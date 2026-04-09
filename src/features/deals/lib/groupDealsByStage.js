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

function resolveDealId(deal, index) {
  const rawId =
    deal?.id ??
    deal?._id ??
    deal?.uuid ??
    deal?.dealId ??
    null

  if (rawId === null || rawId === undefined || rawId === '') {
    return `deal-${index}`
  }

  return String(rawId)
}

function slugify(value) {
  return asText(value)
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
}

function buildStageIndex(stages = []) {
  const stageById = new Map()
  const aliases = new Map()

  stages.forEach((stage) => {
    const stageId = slugify(stage?.id)
    const stageLabel = asText(stage?.label)

    if (!stageId) {
      return
    }

    stageById.set(stageId, {
      stageId,
      label: stageLabel || stageId,
    })

    aliases.set(stageId, stageId)
    if (stageLabel) {
      aliases.set(slugify(stageLabel), stageId)
    }
  })

  return {
    stageById,
    aliases,
    fallbackStageId: slugify(stages[0]?.id) || '',
  }
}

function normalizeStageId(value, stageIndex) {
  const inputValue = typeof value === 'object' ? value?.id ?? value?.name : value
  const normalized = slugify(inputValue)

  if (!normalized) {
    return stageIndex.fallbackStageId
  }

  return stageIndex.aliases.get(normalized) ?? stageIndex.fallbackStageId
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value || 0))
}

function formatDate(value) {
  if (!value) {
    return ''
  }

  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  return parsedDate.toLocaleDateString('en-US')
}

function extractEntityName(entity, fallback = 'Not assigned') {
  if (!entity) {
    return fallback
  }

  if (typeof entity === 'string') {
    return entity
  }

  return (
    asText(entity.name) ||
    asText(entity.fullName) ||
    asText(entity.email) ||
    asText(entity.title) ||
    fallback
  )
}

function normalizeDeal(deal, stageIndex, index) {
  const value = toNumber(deal?.value ?? deal?.amount ?? deal?.totalValue ?? deal?.total)
  const expectedCloseDate =
    deal?.expectedCloseDate ?? deal?.closeDate ?? deal?.expected_close_date ?? deal?.dueDate ?? null

  return {
    id: resolveDealId(deal, index),
    stageId: normalizeStageId(deal?.stage ?? deal?.stageId ?? deal?.pipelineStage, stageIndex),
    title: asText(deal?.title ?? deal?.name) || 'Untitled deal',
    value,
    valueLabel: formatCurrency(value),
    account: extractEntityName(deal?.account ?? deal?.accountId, 'No account'),
    contact: extractEntityName(deal?.contact ?? deal?.contactId, 'No contact'),
    owner: extractEntityName(
      deal?.owner ?? deal?.assignedUser ?? deal?.user ?? deal?.createdBy,
      'Unassigned',
    ),
    expectedCloseDate,
    expectedCloseDateLabel: formatDate(expectedCloseDate) || 'No close date',
  }
}

export function groupDealsByStage(deals = [], stages = []) {
  const stageIndex = buildStageIndex(stages)

  const columns = stages.map((stage) => {
    const stageId = slugify(stage?.id)
    return {
      stageId,
      label: asText(stage?.label) || stageId,
      deals: [],
      totalValue: 0,
      totalValueLabel: formatCurrency(0),
    }
  })

  const columnByStageId = new Map(columns.map((column) => [column.stageId, column]))

  deals.forEach((deal, index) => {
    const normalizedDeal = normalizeDeal(deal, stageIndex, index)
    const column = columnByStageId.get(normalizedDeal.stageId)
    if (!column) {
      return
    }

    column.deals.push(normalizedDeal)
    column.totalValue += normalizedDeal.value
  })

  columns.forEach((column) => {
    column.totalValueLabel = formatCurrency(column.totalValue)
    column.deals.sort((left, right) => {
      if (left.expectedCloseDate && right.expectedCloseDate) {
        return new Date(left.expectedCloseDate).getTime() - new Date(right.expectedCloseDate).getTime()
      }

      if (left.expectedCloseDate && !right.expectedCloseDate) {
        return -1
      }

      if (!left.expectedCloseDate && right.expectedCloseDate) {
        return 1
      }

      return right.value - left.value
    })
  })

  return columns
}

export default groupDealsByStage
