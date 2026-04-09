import { formatDistanceToNow } from 'date-fns'
import { DEAL_PIPELINE_STAGES } from '../../deals/schemas/dealSchema.js'
import {
  mapForecastTrendData,
  mapLostDealsTrendData,
  mapPipelineFunnelData,
  mapRevenueTrendData,
  mapStageDistributionData,
  mapTeamProductivityData,
} from './chartMappers.js'

const COMPACT_CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const STAGE_LABELS = new Map(DEAL_PIPELINE_STAGES.map((stage) => [stage.id, stage.label]))
const STAGE_ORDER = new Map(DEAL_PIPELINE_STAGES.map((stage, index) => [stage.id, index]))

const STAGE_PROBABILITY = Object.freeze({
  'new-lead': 0.2,
  qualified: 0.35,
  proposal: 0.55,
  negotiation: 0.75,
  'closed-won': 1,
  'closed-lost': 0,
})

function asText(value) {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (typeof value === 'number' || typeof value === 'bigint') {
    return String(value)
  }

  return ''
}

function asEntityId(entity, fallbackPrefix, index) {
  if (!entity || typeof entity !== 'object') {
    return `${fallbackPrefix}-${index}`
  }

  const rawId =
    entity.id ??
    entity._id ??
    entity.uuid ??
    entity.accountId ??
    entity.contactId ??
    entity.dealId ??
    entity.leadId ??
    entity.taskId

  if (rawId === null || rawId === undefined || rawId === '') {
    return `${fallbackPrefix}-${index}`
  }

  return String(rawId)
}

function toNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const normalized = value.replace(/[^0-9.-]/g, '')
    const parsed = Number.parseFloat(normalized)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return 0
}

function toDate(value) {
  if (!value) {
    return null
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  return parsedDate
}

function titleCaseFromSlug(value) {
  if (!value) {
    return 'Uncategorized'
  }

  return value
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

function formatCompactCurrency(value) {
  return COMPACT_CURRENCY_FORMATTER.format(value)
}

function formatPercent(value) {
  return `${value.toFixed(1)}%`
}

function formatRelativeDate(date) {
  if (!date) {
    return 'No timestamp'
  }

  return formatDistanceToNow(date, { addSuffix: true })
}

function normalizeStageId(value) {
  const stageToken = typeof value === 'object' ? value?.id ?? value?.name : value
  const normalizedStage = asText(stageToken).toLowerCase().replace(/_/g, '-')

  if (!normalizedStage) {
    return 'new-lead'
  }

  if (STAGE_LABELS.has(normalizedStage)) {
    return normalizedStage
  }

  if (normalizedStage.includes('won')) {
    return 'closed-won'
  }

  if (normalizedStage.includes('lost')) {
    return 'closed-lost'
  }

  if (normalizedStage.includes('qual')) {
    return 'qualified'
  }

  if (normalizedStage.includes('proposal')) {
    return 'proposal'
  }

  if (normalizedStage.includes('nego')) {
    return 'negotiation'
  }

  if (normalizedStage.includes('lead')) {
    return 'new-lead'
  }

  return normalizedStage
}

function normalizeAccountId(value) {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
    return String(value)
  }

  if (typeof value === 'object') {
    return asText(value.id ?? value.accountId ?? value.value)
  }

  return ''
}

function normalizeLookupToken(value) {
  return asText(value).toLowerCase()
}

function getDealValue(deal) {
  return toNumber(deal?.value ?? deal?.amount ?? deal?.totalValue ?? deal?.total)
}

function getDealStageId(deal) {
  return normalizeStageId(deal?.stage ?? deal?.stageId ?? deal?.pipelineStage)
}

function getDealAccountId(deal) {
  return normalizeAccountId(deal?.accountId ?? deal?.account)
}

function getDealDate(deal) {
  return toDate(
    deal?.closeDate ??
      deal?.expectedCloseDate ??
      deal?.expected_close_date ??
      deal?.wonAt ??
      deal?.updatedAt ??
      deal?.createdAt,
  )
}

function isClosedWonDeal(deal) {
  const stageId = getDealStageId(deal)
  if (stageId === 'closed-won') {
    return true
  }

  const statusToken = asText(deal?.status).toLowerCase()
  return statusToken.includes('won')
}

function isClosedLostDeal(deal) {
  const stageId = getDealStageId(deal)
  if (stageId === 'closed-lost') {
    return true
  }

  const statusToken = asText(deal?.status).toLowerCase()
  return statusToken.includes('lost')
}

function isOpenDeal(deal) {
  return !isClosedWonDeal(deal) && !isClosedLostDeal(deal)
}

function getDealTitle(deal) {
  return asText(deal?.title ?? deal?.name) || 'Untitled deal'
}

function getLeadName(lead) {
  return asText(lead?.name ?? lead?.fullName) || 'Unnamed lead'
}

function getAccountName(account) {
  return asText(account?.name ?? account?.companyName) || 'Unnamed account'
}

function getContactName(contact) {
  return asText(contact?.name ?? contact?.fullName) || 'Unnamed contact'
}

function getTaskTitle(task) {
  return asText(task?.title ?? task?.name) || 'Untitled task'
}

function isTaskDone(task) {
  const statusToken = asText(task?.status).toLowerCase().replace(/\s/g, '-')
  return ['done', 'completed', 'closed', 'resolved'].includes(statusToken)
}

function isTaskOverdue(task, now = new Date()) {
  if (isTaskDone(task)) {
    return false
  }

  const dueDate = toDate(task?.dueDate ?? task?.due_at ?? task?.deadline)
  if (!dueDate) {
    return false
  }

  return dueDate.getTime() < now.getTime()
}

function mapKpiCards({ deals, leads, tasks }) {
  const now = new Date()
  const openDeals = deals.filter(isOpenDeal)
  const wonDeals = deals.filter(isClosedWonDeal)
  const lostDeals = deals.filter(isClosedLostDeal)
  const openTasks = tasks.filter((task) => !isTaskDone(task))
  const overdueTasks = tasks.filter((task) => isTaskOverdue(task, now))
  const qualifiedLeads = leads.filter((lead) => {
    const status = asText(lead?.status).toLowerCase()
    return ['qualified', 'proposal', 'contacted'].includes(status)
  })
  const conversionRate = leads.length ? (wonDeals.length / leads.length) * 100 : 0

  const pipelineValue = openDeals.reduce((sum, deal) => sum + getDealValue(deal), 0)
  const closedRevenue = wonDeals.reduce((sum, deal) => sum + getDealValue(deal), 0)
  const forecastValue = openDeals.reduce((sum, deal) => {
    const stageProbability = STAGE_PROBABILITY[getDealStageId(deal)] ?? 0.25
    return sum + getDealValue(deal) * stageProbability
  }, 0)

  return [
    {
      id: 'total-leads',
      label: 'Total leads',
      value: String(leads.length),
      meta: `${qualifiedLeads.length} qualified`,
      note: `${Math.max(leads.length - qualifiedLeads.length, 0)} early stage`,
    },
    {
      id: 'total-deals',
      label: 'Total deals',
      value: String(deals.length),
      meta: `${openDeals.length} open`,
      note: `${wonDeals.length} won`,
    },
    {
      id: 'pipeline-value',
      label: 'Pipeline value',
      value: formatCompactCurrency(pipelineValue),
      meta: `${openDeals.length} open opportunities`,
      note: `Avg ${formatCompactCurrency(openDeals.length ? pipelineValue / openDeals.length : 0)} per deal`,
    },
    {
      id: 'closed-revenue',
      label: 'Closed revenue',
      value: formatCompactCurrency(closedRevenue),
      meta: `${wonDeals.length} won deals`,
      note: `${lostDeals.length} lost deals`,
    },
    {
      id: 'conversion-rate',
      label: 'Conversion rate',
      value: formatPercent(conversionRate),
      meta: `${wonDeals.length} won / ${leads.length || 0} leads`,
      note: `${formatPercent(leads.length ? (qualifiedLeads.length / leads.length) * 100 : 0)} qualification`,
    },
    {
      id: 'open-tasks',
      label: 'Open tasks',
      value: String(openTasks.length),
      meta: `${tasks.length} total tasks`,
      note: `${overdueTasks.length} overdue`,
    },
    {
      id: 'overdue-tasks',
      label: 'Overdue tasks',
      value: String(overdueTasks.length),
      meta: `${openTasks.length} open tasks`,
      note: `${formatPercent(openTasks.length ? (overdueTasks.length / openTasks.length) * 100 : 0)} of open tasks`,
    },
    {
      id: 'forecast-value',
      label: 'Forecast value',
      value: formatCompactCurrency(forecastValue),
      meta: `${deals.length} total deals`,
      note: `${formatPercent(pipelineValue ? (forecastValue / pipelineValue) * 100 : 0)} of pipeline value`,
    },
  ]
}

function mapPipelineSeries(deals) {
  const baseStages = DEAL_PIPELINE_STAGES.map((stage) => ({
    stageId: stage.id,
    label: stage.label,
    dealCount: 0,
    pipelineValue: 0,
  }))

  const byStage = new Map(baseStages.map((stage) => [stage.stageId, { ...stage }]))

  deals.forEach((deal) => {
    const stageId = getDealStageId(deal)
    if (!byStage.has(stageId)) {
      byStage.set(stageId, {
        stageId,
        label: titleCaseFromSlug(stageId),
        dealCount: 0,
        pipelineValue: 0,
      })
    }

    const stage = byStage.get(stageId)
    stage.dealCount += 1
    stage.pipelineValue += getDealValue(deal)
  })

  return Array.from(byStage.values()).sort((left, right) => {
    const leftRank = STAGE_ORDER.get(left.stageId) ?? Number.MAX_SAFE_INTEGER
    const rightRank = STAGE_ORDER.get(right.stageId) ?? Number.MAX_SAFE_INTEGER
    return leftRank - rightRank
  })
}

function buildMonthBuckets(monthCount = 6) {
  const now = new Date()
  const monthFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: '2-digit',
  })

  const buckets = []
  for (let offset = monthCount - 1; offset >= 0; offset -= 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - offset, 1)
    const key = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`
    buckets.push({
      key,
      label: monthFormatter.format(monthDate),
    })
  }

  return buckets
}

function mapRevenueSeries(deals) {
  const wonDeals = deals.filter(isClosedWonDeal)
  const sourceDeals = wonDeals.length ? wonDeals : deals
  const monthBuckets = buildMonthBuckets(6)
  const byMonth = new Map(
    monthBuckets.map((bucket) => [
      bucket.key,
      {
        month: bucket.label,
        revenue: 0,
        wonDeals: 0,
      },
    ]),
  )

  sourceDeals.forEach((deal) => {
    const dealDate = getDealDate(deal)
    if (!dealDate) {
      return
    }

    const key = `${dealDate.getFullYear()}-${String(dealDate.getMonth() + 1).padStart(2, '0')}`
    if (!byMonth.has(key)) {
      return
    }

    const monthSeries = byMonth.get(key)
    monthSeries.revenue += getDealValue(deal)
    monthSeries.wonDeals += 1
  })

  const series = monthBuckets.map((bucket) => byMonth.get(bucket.key))
  const hasRevenue = series.some((entry) => entry.revenue > 0)

  if (!hasRevenue && sourceDeals.length > 0) {
    const aggregateRevenue = sourceDeals.reduce((sum, deal) => sum + getDealValue(deal), 0)
    const lastEntry = series[series.length - 1]
    lastEntry.revenue = aggregateRevenue
    lastEntry.wonDeals = sourceDeals.length
  }

  return series
}

function mapAccountRows(accounts, contacts, deals) {
  const normalizedAccounts = accounts.map((account, index) => {
    const accountId = asEntityId(account, 'account', index)
    return {
      account,
      accountId,
      accountName: getAccountName(account),
    }
  })

  const accountNameToId = new Map()
  const accountIdSet = new Set()
  normalizedAccounts.forEach(({ accountId, accountName }) => {
    accountIdSet.add(accountId)
    const token = normalizeLookupToken(accountName)
    if (token) {
      accountNameToId.set(token, accountId)
    }
  })

  const contactCountByAccount = new Map()
  contacts.forEach((contact) => {
    const rawAccountId = normalizeAccountId(contact?.accountId ?? contact?.account ?? contact?.company)
    const rawAccountName = asText(contact?.account?.name ?? contact?.company?.name ?? contact?.company)
    const resolvedAccountId =
      (rawAccountId && accountIdSet.has(rawAccountId) && rawAccountId) ||
      accountNameToId.get(normalizeLookupToken(rawAccountName)) ||
      rawAccountId

    if (!resolvedAccountId) {
      return
    }

    contactCountByAccount.set(
      resolvedAccountId,
      (contactCountByAccount.get(resolvedAccountId) ?? 0) + 1,
    )
  })

  const openDealsByAccount = new Map()
  deals.forEach((deal) => {
    const rawAccountId = getDealAccountId(deal)
    const rawAccountName = asText(deal?.account?.name ?? deal?.account)
    const resolvedAccountId =
      (rawAccountId && accountIdSet.has(rawAccountId) && rawAccountId) ||
      accountNameToId.get(normalizeLookupToken(rawAccountName)) ||
      rawAccountId

    if (!resolvedAccountId) {
      return
    }

    const currentTotals = openDealsByAccount.get(resolvedAccountId) ?? {
      dealCount: 0,
      pipelineValue: 0,
    }

    if (isOpenDeal(deal)) {
      currentTotals.dealCount += 1
      currentTotals.pipelineValue += getDealValue(deal)
    }

    openDealsByAccount.set(resolvedAccountId, currentTotals)
  })

  return normalizedAccounts
    .map(({ account, accountId, accountName }) => {
      const openDealSummary = openDealsByAccount.get(accountId) ?? {
        dealCount: 0,
        pipelineValue: 0,
      }

      return {
        id: accountId,
        name: accountName,
        industry: asText(account?.industry ?? account?.segment) || 'Unspecified',
        contactCount: contactCountByAccount.get(accountId) ?? 0,
        openDealCount: openDealSummary.dealCount,
        pipelineValue: openDealSummary.pipelineValue,
        pipelineValueLabel: formatCompactCurrency(openDealSummary.pipelineValue),
      }
    })
    .sort((left, right) => {
      if (right.pipelineValue !== left.pipelineValue) {
        return right.pipelineValue - left.pipelineValue
      }

      return right.openDealCount - left.openDealCount
    })
}

function mapActivityItems({ deals, leads, accounts, contacts, tasks }) {
  const dealItems = deals.map((deal, index) => {
    const stageId = getDealStageId(deal)
    const stageLabel = STAGE_LABELS.get(stageId) ?? titleCaseFromSlug(stageId)
    const updatedAt = toDate(deal?.updatedAt ?? deal?.createdAt ?? deal?.closeDate)

    return {
      id: `deal-${asEntityId(deal, 'deal', index)}`,
      title: `${getDealTitle(deal)} moved to ${stageLabel}`,
      meta: `Deal | ${formatCompactCurrency(getDealValue(deal))} | ${formatRelativeDate(updatedAt)}`,
      timestamp: updatedAt?.getTime() ?? 0,
    }
  })

  const leadItems = leads.map((lead, index) => {
    const leadStatus = asText(lead?.status).toLowerCase() || 'new'
    const sourceLabel = asText(lead?.source).toLowerCase() || 'unknown source'
    const updatedAt = toDate(lead?.updatedAt ?? lead?.createdAt)

    return {
      id: `lead-${asEntityId(lead, 'lead', index)}`,
      title: `${getLeadName(lead)} marked as ${leadStatus}`,
      meta: `Lead | ${sourceLabel} | ${formatRelativeDate(updatedAt)}`,
      timestamp: updatedAt?.getTime() ?? 0,
    }
  })

  const taskItems = tasks.map((task, index) => {
    const taskStatus = asText(task?.status).toLowerCase() || 'todo'
    const dueDate = toDate(task?.dueDate ?? task?.due_at ?? task?.deadline)
    const updatedAt = toDate(task?.updatedAt ?? task?.createdAt ?? dueDate)

    return {
      id: `task-${asEntityId(task, 'task', index)}`,
      title: `${getTaskTitle(task)} is ${taskStatus}`,
      meta: `Task | Due ${dueDate ? dueDate.toLocaleDateString('en-US') : 'not set'} | ${formatRelativeDate(updatedAt)}`,
      timestamp: updatedAt?.getTime() ?? 0,
    }
  })

  const accountItems = accounts.map((account, index) => {
    const updatedAt = toDate(account?.updatedAt ?? account?.createdAt)
    const industry = asText(account?.industry ?? account?.segment) || 'general'

    return {
      id: `account-${asEntityId(account, 'account', index)}`,
      title: `${getAccountName(account)} account updated`,
      meta: `Account | ${industry} | ${formatRelativeDate(updatedAt)}`,
      timestamp: updatedAt?.getTime() ?? 0,
    }
  })

  const contactItems = contacts.map((contact, index) => {
    const updatedAt = toDate(contact?.updatedAt ?? contact?.createdAt)
    const accountName = asText(contact?.account?.name ?? contact?.company?.name ?? contact?.company)

    return {
      id: `contact-${asEntityId(contact, 'contact', index)}`,
      title: `${getContactName(contact)} contact record updated`,
      meta: `Contact | ${accountName || 'unlinked'} | ${formatRelativeDate(updatedAt)}`,
      timestamp: updatedAt?.getTime() ?? 0,
    }
  })

  return [...dealItems, ...leadItems, ...taskItems, ...accountItems, ...contactItems]
    .sort((left, right) => right.timestamp - left.timestamp)
    .slice(0, 8)
}

export function mapDashboardViewModel({
  deals = [],
  leads = [],
  accounts = [],
  contacts = [],
  tasks = [],
} = {}) {
  return {
    kpiCards: mapKpiCards({ deals, leads, tasks }),
    pipelineFunnelSeries: mapPipelineFunnelData(deals),
    revenueTrendSeries: mapRevenueTrendData(deals),
    forecastTrendSeries: mapForecastTrendData(deals),
    stageDistributionSeries: mapStageDistributionData(deals),
    teamProductivitySeries: mapTeamProductivityData({ deals, tasks }),
    lostDealsTrendSeries: mapLostDealsTrendData(deals),
    pipelineSeries: mapPipelineSeries(deals),
    revenueSeries: mapRevenueSeries(deals),
    activityItems: mapActivityItems({ deals, leads, accounts, contacts, tasks }),
    accountRows: mapAccountRows(accounts, contacts, deals),
    totals: {
      deals: deals.length,
      leads: leads.length,
      accounts: accounts.length,
      contacts: contacts.length,
      tasks: tasks.length,
    },
  }
}

export default mapDashboardViewModel
