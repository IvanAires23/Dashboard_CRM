import { DEAL_PIPELINE_STAGES } from '../../deals/schemas/dealSchema.js'

const STAGE_ORDER = new Map(DEAL_PIPELINE_STAGES.map((stage, index) => [stage.id, index]))
const STAGE_LABELS = new Map(DEAL_PIPELINE_STAGES.map((stage) => [stage.id, stage.label]))

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

function getDealValue(deal) {
  return toNumber(deal?.value ?? deal?.amount ?? deal?.totalValue ?? deal?.total)
}

function getDealStageId(deal) {
  return normalizeStageId(deal?.stage ?? deal?.stageId ?? deal?.pipelineStage)
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

function getDealOwnerName(deal) {
  const owner = deal?.owner ?? deal?.assignedUser ?? deal?.user ?? deal?.createdBy
  const ownerName =
    asText(owner?.name ?? owner?.fullName ?? owner?.email) ||
    asText(deal?.ownerName ?? deal?.assigneeName ?? deal?.salesRep)
  return ownerName || 'Unassigned'
}

function getTaskOwnerName(task) {
  const owner = task?.assignedUser ?? task?.owner ?? task?.user
  const ownerName =
    asText(owner?.name ?? owner?.fullName ?? owner?.email) ||
    asText(task?.assignedUserName ?? task?.ownerName ?? task?.assignee)
  return ownerName || 'Unassigned'
}

function isTaskDone(task) {
  const statusToken = asText(task?.status).toLowerCase().replace(/\s/g, '-')
  return ['done', 'completed', 'closed', 'resolved'].includes(statusToken)
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

function buildStageMap() {
  const stageMap = new Map()

  DEAL_PIPELINE_STAGES.forEach((stage) => {
    stageMap.set(stage.id, {
      stageId: stage.id,
      stage: stage.label,
      deals: 0,
      value: 0,
    })
  })

  return stageMap
}

export function mapStageDistributionData(deals = []) {
  const stageMap = buildStageMap()

  deals.forEach((deal) => {
    const stageId = getDealStageId(deal)
    if (!stageMap.has(stageId)) {
      stageMap.set(stageId, {
        stageId,
        stage: titleCaseFromSlug(stageId),
        deals: 0,
        value: 0,
      })
    }

    const stage = stageMap.get(stageId)
    stage.deals += 1
    stage.value += getDealValue(deal)
  })

  const series = Array.from(stageMap.values()).sort((left, right) => {
    const leftRank = STAGE_ORDER.get(left.stageId) ?? Number.MAX_SAFE_INTEGER
    const rightRank = STAGE_ORDER.get(right.stageId) ?? Number.MAX_SAFE_INTEGER
    return leftRank - rightRank
  })

  const totalDeals = series.reduce((sum, stage) => sum + stage.deals, 0)

  return series.map((stage) => ({
    ...stage,
    share: totalDeals ? (stage.deals / totalDeals) * 100 : 0,
  }))
}

export function mapPipelineFunnelData(deals = []) {
  const stageDistribution = mapStageDistributionData(deals)
    .filter((stage) => stage.deals > 0 && stage.stageId !== 'closed-lost')

  if (!stageDistribution.length) {
    return []
  }

  const funnelStages = []
  let previousStageDeals = Number.POSITIVE_INFINITY

  stageDistribution.forEach((stage) => {
    const funnelDeals = Math.min(previousStageDeals, stage.deals)
    previousStageDeals = funnelDeals

    funnelStages.push({
      ...stage,
      actualDeals: stage.deals,
      funnelDeals,
    })
  })

  const topStageCount = funnelStages[0]?.funnelDeals || 0

  return funnelStages.map((stage) => ({
    ...stage,
    conversionFromTop: topStageCount ? (stage.funnelDeals / topStageCount) * 100 : 0,
  }))
}

export function mapRevenueTrendData(deals = []) {
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

    const monthData = byMonth.get(key)
    monthData.revenue += getDealValue(deal)
    monthData.wonDeals += 1
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

export function mapForecastTrendData(deals = []) {
  const openDeals = deals.filter(isOpenDeal)
  const monthBuckets = buildMonthBuckets(6)
  const byMonth = new Map(
    monthBuckets.map((bucket) => [
      bucket.key,
      {
        month: bucket.label,
        pipelineValue: 0,
        forecastValue: 0,
        openDeals: 0,
      },
    ]),
  )

  openDeals.forEach((deal) => {
    const dealDate = getDealDate(deal)
    if (!dealDate) {
      return
    }

    const key = `${dealDate.getFullYear()}-${String(dealDate.getMonth() + 1).padStart(2, '0')}`
    if (!byMonth.has(key)) {
      return
    }

    const stageId = getDealStageId(deal)
    const probability = STAGE_PROBABILITY[stageId] ?? 0.25
    const dealValue = getDealValue(deal)

    const monthData = byMonth.get(key)
    monthData.pipelineValue += dealValue
    monthData.forecastValue += dealValue * probability
    monthData.openDeals += 1
  })

  const series = monthBuckets.map((bucket) => byMonth.get(bucket.key))
  const hasData = series.some((entry) => entry.pipelineValue > 0 || entry.forecastValue > 0)

  if (!hasData && openDeals.length > 0) {
    const fallbackTotals = openDeals.reduce(
      (totals, deal) => {
        const stageId = getDealStageId(deal)
        const probability = STAGE_PROBABILITY[stageId] ?? 0.25
        const dealValue = getDealValue(deal)
        totals.pipelineValue += dealValue
        totals.forecastValue += dealValue * probability
        totals.openDeals += 1
        return totals
      },
      {
        pipelineValue: 0,
        forecastValue: 0,
        openDeals: 0,
      },
    )

    const lastEntry = series[series.length - 1]
    lastEntry.pipelineValue = fallbackTotals.pipelineValue
    lastEntry.forecastValue = fallbackTotals.forecastValue
    lastEntry.openDeals = fallbackTotals.openDeals
  }

  return series
}

export function mapTeamProductivityData({ deals = [], tasks = [] } = {}) {
  const totalsByOwner = new Map()

  tasks.forEach((task) => {
    const ownerName = getTaskOwnerName(task)
    const currentOwner = totalsByOwner.get(ownerName) ?? {
      owner: ownerName,
      completedTasks: 0,
      openTasks: 0,
      wonDeals: 0,
      activeDeals: 0,
      productivityScore: 0,
    }

    if (isTaskDone(task)) {
      currentOwner.completedTasks += 1
    } else {
      currentOwner.openTasks += 1
    }

    totalsByOwner.set(ownerName, currentOwner)
  })

  deals.forEach((deal) => {
    const ownerName = getDealOwnerName(deal)
    const currentOwner = totalsByOwner.get(ownerName) ?? {
      owner: ownerName,
      completedTasks: 0,
      openTasks: 0,
      wonDeals: 0,
      activeDeals: 0,
      productivityScore: 0,
    }

    if (isClosedWonDeal(deal)) {
      currentOwner.wonDeals += 1
    } else if (isOpenDeal(deal)) {
      currentOwner.activeDeals += 1
    }

    totalsByOwner.set(ownerName, currentOwner)
  })

  return Array.from(totalsByOwner.values())
    .map((ownerTotals) => {
      const productivityScore =
        ownerTotals.completedTasks * 2 + ownerTotals.wonDeals * 3 + ownerTotals.activeDeals
      return {
        ...ownerTotals,
        productivityScore,
      }
    })
    .sort((left, right) => right.productivityScore - left.productivityScore)
    .slice(0, 6)
}

export function mapLostDealsTrendData(deals = []) {
  const lostDeals = deals.filter(isClosedLostDeal)
  const monthBuckets = buildMonthBuckets(6)
  const byMonth = new Map(
    monthBuckets.map((bucket) => [
      bucket.key,
      {
        month: bucket.label,
        lostDeals: 0,
        lostValue: 0,
      },
    ]),
  )

  lostDeals.forEach((deal) => {
    const dealDate = getDealDate(deal)
    if (!dealDate) {
      return
    }

    const key = `${dealDate.getFullYear()}-${String(dealDate.getMonth() + 1).padStart(2, '0')}`
    if (!byMonth.has(key)) {
      return
    }

    const monthData = byMonth.get(key)
    monthData.lostDeals += 1
    monthData.lostValue += getDealValue(deal)
  })

  const series = monthBuckets.map((bucket) => byMonth.get(bucket.key))
  const hasLoss = series.some((entry) => entry.lostDeals > 0 || entry.lostValue > 0)

  if (!hasLoss && lostDeals.length > 0) {
    const aggregateValue = lostDeals.reduce((sum, deal) => sum + getDealValue(deal), 0)
    const lastEntry = series[series.length - 1]
    lastEntry.lostDeals = lostDeals.length
    lastEntry.lostValue = aggregateValue
  }

  return series
}
