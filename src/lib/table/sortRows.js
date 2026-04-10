const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
})

function normalizeDirection(direction) {
  return direction === 'desc' ? 'desc' : 'asc'
}

function toTimestamp(value) {
  if (!value) {
    return null
  }

  if (value instanceof Date) {
    const parsed = value.getTime()
    return Number.isNaN(parsed) ? null : parsed
  }

  const parsedDate = new Date(value)
  const parsed = parsedDate.getTime()
  return Number.isNaN(parsed) ? null : parsed
}

function getColumnById(columns = [], columnId) {
  return columns.find((column) => column.id === columnId) || null
}

function resolveColumnValue(row, column) {
  if (!column) {
    return ''
  }

  if (typeof column.sortAccessor === 'function') {
    return column.sortAccessor(row)
  }

  if (typeof column.accessor === 'function') {
    return column.accessor(row)
  }

  return row?.[column.id]
}

function compareValues(leftValue, rightValue, sortType) {
  if (leftValue === rightValue) {
    return 0
  }

  const leftIsEmpty = leftValue === null || leftValue === undefined || leftValue === ''
  const rightIsEmpty = rightValue === null || rightValue === undefined || rightValue === ''

  if (leftIsEmpty || rightIsEmpty) {
    if (leftIsEmpty && rightIsEmpty) {
      return 0
    }

    return leftIsEmpty ? 1 : -1
  }

  if (sortType === 'number') {
    const leftNumber = Number(leftValue)
    const rightNumber = Number(rightValue)

    if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) {
      if (leftNumber === rightNumber) {
        return 0
      }
      return leftNumber > rightNumber ? 1 : -1
    }
  }

  if (sortType === 'date') {
    const leftTimestamp = toTimestamp(leftValue)
    const rightTimestamp = toTimestamp(rightValue)

    if (leftTimestamp !== null && rightTimestamp !== null) {
      if (leftTimestamp === rightTimestamp) {
        return 0
      }
      return leftTimestamp > rightTimestamp ? 1 : -1
    }
  }

  return collator.compare(String(leftValue), String(rightValue))
}

export function sortRows(rows = [], config = {}, columns = []) {
  const {
    columnId = '',
    direction = 'asc',
  } = config
  const normalizedDirection = normalizeDirection(direction)
  const directionFactor = normalizedDirection === 'desc' ? -1 : 1
  const column = getColumnById(columns, columnId)

  if (!column || column.sortable === false) {
    return [...rows]
  }

  const sortedRows = [...rows]
  sortedRows.sort((leftRow, rightRow) => {
    const leftValue = resolveColumnValue(leftRow, column)
    const rightValue = resolveColumnValue(rightRow, column)
    const compared = compareValues(leftValue, rightValue, column.sortType)
    return compared * directionFactor
  })

  return sortedRows
}

export default sortRows
