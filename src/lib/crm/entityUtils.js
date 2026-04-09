export function extractCollection(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  const collectionKeys = [
    'data',
    'items',
    'results',
    'rows',
    'records',
    'leads',
    'deals',
    'accounts',
    'contacts',
    'tasks',
  ]

  for (const key of collectionKeys) {
    if (Array.isArray(payload[key])) {
      return payload[key]
    }
  }

  return []
}

export function extractEntity(payload) {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const entityKeys = ['data', 'item', 'record', 'lead', 'deal', 'account', 'contact', 'task']

  for (const key of entityKeys) {
    const value = payload[key]
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value
    }
  }

  return payload
}

export function resolveEntityId(entity) {
  if (!entity || typeof entity !== 'object') {
    return ''
  }

  const rawId =
    entity.id ??
    entity._id ??
    entity.uuid ??
    entity.leadId ??
    entity.dealId ??
    entity.accountId ??
    entity.contactId ??
    entity.taskId ??
    null

  if (rawId === null || rawId === undefined) {
    return ''
  }

  return String(rawId)
}

export function getDisplayValue(value) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(', ') : '—'
  }

  if (typeof value === 'object') {
    return (
      value.name ??
      value.title ??
      value.label ??
      value.email ??
      value.id ??
      '—'
    )
  }

  return String(value)
}

export function matchesSearch(value, searchTerm) {
  const normalizedSearch = String(searchTerm || '').trim().toLowerCase()
  if (!normalizedSearch) {
    return true
  }

  const normalizedValue = String(value ?? '').toLowerCase()
  return normalizedValue.includes(normalizedSearch)
}

export function matchesAnySearch(entity, searchTerm, selectors = []) {
  if (!String(searchTerm || '').trim()) {
    return true
  }

  return selectors.some((selector) => matchesSearch(selector(entity), searchTerm))
}

export function getTotalPages(totalItems, pageSize) {
  if (!pageSize || pageSize <= 0) {
    return 1
  }

  return Math.max(1, Math.ceil(totalItems / pageSize))
}

export function getPageRows(rows, currentPage, pageSize) {
  const startIndex = (currentPage - 1) * pageSize
  return rows.slice(startIndex, startIndex + pageSize)
}

export function getFilterOptions(rows, selector) {
  const uniqueValues = new Set()

  rows.forEach((row) => {
    const nextValue = selector(row)
    if (nextValue) {
      uniqueValues.add(String(nextValue))
    }
  })

  return Array.from(uniqueValues).sort((a, b) => a.localeCompare(b))
}

