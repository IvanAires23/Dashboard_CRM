function normalizeText(value) {
  if (typeof value === 'string') {
    return value.trim().toLowerCase()
  }

  if (typeof value === 'number' || typeof value === 'bigint') {
    return String(value).toLowerCase()
  }

  return ''
}

function toTimestamp(value) {
  if (!value) {
    return null
  }

  if (value instanceof Date) {
    const timestamp = value.getTime()
    return Number.isNaN(timestamp) ? null : timestamp
  }

  const parsedDate = new Date(value)
  const timestamp = parsedDate.getTime()
  return Number.isNaN(timestamp) ? null : timestamp
}

function matchesSearch(row, term, selectors = []) {
  const normalizedTerm = normalizeText(term)
  if (!normalizedTerm) {
    return true
  }

  return selectors.some((selector) => {
    const selectedValue = selector(row)
    const normalizedValue = normalizeText(selectedValue)
    return normalizedValue.includes(normalizedTerm)
  })
}

function matchesEqualFilters(row, equalFilters = []) {
  return equalFilters.every((filter) => {
    const {
      value,
      selector,
      emptyValue = 'all',
    } = filter

    const normalizedValue = normalizeText(value)
    const normalizedEmptyValue = normalizeText(emptyValue)

    if (!normalizedValue || normalizedValue === normalizedEmptyValue) {
      return true
    }

    const rowValue = normalizeText(selector(row))
    return rowValue === normalizedValue
  })
}

function matchesDateRangeFilters(row, dateRangeFilters = []) {
  return dateRangeFilters.every((filter) => {
    const {
      from,
      to,
      selector,
    } = filter

    if (!from && !to) {
      return true
    }

    const rowTimestamp = toTimestamp(selector(row))
    if (rowTimestamp === null) {
      return false
    }

    const fromTimestamp = toTimestamp(from)
    const toTimestampValue = toTimestamp(to)

    if (fromTimestamp !== null && rowTimestamp < fromTimestamp) {
      return false
    }

    if (toTimestampValue !== null) {
      const endOfDayTimestamp = new Date(toTimestampValue).setHours(23, 59, 59, 999)
      if (rowTimestamp > endOfDayTimestamp) {
        return false
      }
    }

    return true
  })
}

function matchesCustomFilters(row, customFilters = []) {
  return customFilters.every((filterFn) => filterFn(row))
}

export function applyFilters(rows = [], config = {}) {
  const {
    searchTerm = '',
    searchSelectors = [],
    equalFilters = [],
    dateRangeFilters = [],
    customFilters = [],
  } = config

  return rows.filter((row) => {
    return (
      matchesSearch(row, searchTerm, searchSelectors) &&
      matchesEqualFilters(row, equalFilters) &&
      matchesDateRangeFilters(row, dateRangeFilters) &&
      matchesCustomFilters(row, customFilters)
    )
  })
}

export function collectFilterOptions(rows = [], selector) {
  const values = new Set()

  rows.forEach((row) => {
    const rawValue = selector(row)
    const normalizedValue = normalizeText(rawValue)
    if (normalizedValue) {
      values.add(normalizedValue)
    }
  })

  return Array.from(values).sort((left, right) => left.localeCompare(right))
}

export default {
  applyFilters,
  collectFilterOptions,
}
