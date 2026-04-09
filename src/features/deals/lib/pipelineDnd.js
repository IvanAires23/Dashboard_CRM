import { arrayMove } from '@dnd-kit/sortable'

function toId(value) {
  if (value === null || value === undefined) {
    return ''
  }

  return String(value)
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value || 0))
}

function cloneColumns(columns = []) {
  return columns.map((column) => ({
    ...column,
    deals: [...(column.deals ?? [])],
  }))
}

export function findDealLocation(columns = [], dealId) {
  const normalizedDealId = toId(dealId)

  for (const column of columns) {
    const index = (column.deals ?? []).findIndex((deal) => toId(deal.id) === normalizedDealId)
    if (index >= 0) {
      return {
        stageId: column.stageId,
        index,
      }
    }
  }

  return null
}

export function findDealById(columns = [], dealId) {
  const location = findDealLocation(columns, dealId)
  if (!location) {
    return null
  }

  const column = columns.find((entry) => toId(entry.stageId) === toId(location.stageId))
  return column?.deals?.[location.index] ?? null
}

function resolveDestinationStageId(columns = [], overId) {
  const normalizedOverId = toId(overId)
  if (!normalizedOverId) {
    return ''
  }

  const column = columns.find((entry) => toId(entry.stageId) === normalizedOverId)
  if (column) {
    return column.stageId
  }

  const location = findDealLocation(columns, normalizedOverId)
  return location?.stageId ?? ''
}

function resolveInsertionIndex(columns = [], destinationStageId, overId) {
  const destinationColumn = columns.find((entry) => toId(entry.stageId) === toId(destinationStageId))
  if (!destinationColumn) {
    return -1
  }

  const normalizedOverId = toId(overId)
  if (!normalizedOverId || normalizedOverId === toId(destinationStageId)) {
    return destinationColumn.deals.length
  }

  const location = findDealLocation(columns, normalizedOverId)
  if (!location || toId(location.stageId) !== toId(destinationStageId)) {
    return destinationColumn.deals.length
  }

  return location.index
}

function recalculateColumnTotals(columns = []) {
  return columns.map((column) => {
    const totalValue = (column.deals ?? []).reduce(
      (sum, deal) => sum + Number(deal.value || 0),
      0,
    )

    return {
      ...column,
      totalValue,
      totalValueLabel: formatCurrency(totalValue),
    }
  })
}

export function applyPipelineDrag(columns = [], { activeDealId, overId }) {
  const normalizedActiveId = toId(activeDealId)
  const normalizedOverId = toId(overId)

  if (!normalizedActiveId || !normalizedOverId || normalizedActiveId === normalizedOverId) {
    return null
  }

  const sourceLocation = findDealLocation(columns, normalizedActiveId)
  if (!sourceLocation) {
    return null
  }

  const destinationStageId = resolveDestinationStageId(columns, normalizedOverId)
  if (!destinationStageId) {
    return null
  }

  const nextColumns = cloneColumns(columns)
  const sourceColumn = nextColumns.find((entry) => toId(entry.stageId) === toId(sourceLocation.stageId))
  const destinationColumn = nextColumns.find(
    (entry) => toId(entry.stageId) === toId(destinationStageId),
  )

  if (!sourceColumn || !destinationColumn) {
    return null
  }

  if (toId(sourceColumn.stageId) === toId(destinationColumn.stageId)) {
    const targetIndex = resolveInsertionIndex(nextColumns, destinationColumn.stageId, normalizedOverId)
    if (targetIndex < 0 || sourceLocation.index === targetIndex) {
      return null
    }

    sourceColumn.deals = arrayMove(sourceColumn.deals, sourceLocation.index, targetIndex)

    return {
      columns: recalculateColumnTotals(nextColumns),
      movement: {
        dealId: normalizedActiveId,
        fromStageId: sourceColumn.stageId,
        toStageId: destinationColumn.stageId,
      },
    }
  }

  const [movedDeal] = sourceColumn.deals.splice(sourceLocation.index, 1)
  if (!movedDeal) {
    return null
  }

  const insertionIndex = resolveInsertionIndex(nextColumns, destinationColumn.stageId, normalizedOverId)
  const safeIndex = insertionIndex < 0 ? destinationColumn.deals.length : insertionIndex
  destinationColumn.deals.splice(safeIndex, 0, {
    ...movedDeal,
    stageId: destinationColumn.stageId,
  })

  return {
    columns: recalculateColumnTotals(nextColumns),
    movement: {
      dealId: normalizedActiveId,
      fromStageId: sourceColumn.stageId,
      toStageId: destinationColumn.stageId,
    },
  }
}

export default {
  applyPipelineDrag,
  findDealById,
  findDealLocation,
}
