export const MIN_GLOBAL_SEARCH_LENGTH = 2

function normalizeSearchText(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

function tokenizeQuery(query) {
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) {
    return []
  }

  return normalizedQuery.split(' ').filter(Boolean)
}

function createSearchableText(entity) {
  if (Array.isArray(entity.searchValues) && entity.searchValues.length) {
    return normalizeSearchText(entity.searchValues.join(' '))
  }

  return normalizeSearchText(`${entity.title ?? ''} ${entity.subtitle ?? ''} ${entity.meta ?? ''}`)
}

export function buildSearchIndex(entities = []) {
  return entities.map((entity, position) => ({
    ...entity,
    searchableText: createSearchableText(entity),
    position,
  }))
}

function entryMatchesTokens(entry, tokens) {
  if (!tokens.length) {
    return true
  }

  return tokens.every((token) => entry.searchableText.includes(token))
}

function scoreEntry(entry, normalizedQuery, tokens) {
  const normalizedTitle = normalizeSearchText(entry.title)
  let score = 0

  if (normalizedTitle === normalizedQuery) {
    score += 140
  }

  if (normalizedTitle.startsWith(normalizedQuery)) {
    score += 90
  }

  if (normalizedTitle.includes(normalizedQuery)) {
    score += 55
  }

  if (entry.searchableText.includes(normalizedQuery)) {
    score += 25
  }

  tokens.forEach((token) => {
    if (normalizedTitle.includes(token)) {
      score += 22
    } else if (entry.searchableText.includes(token)) {
      score += 8
    }
  })

  return score
}

export function searchIndex(index = [], query, options = {}) {
  const {
    limit = 20,
    minLength = MIN_GLOBAL_SEARCH_LENGTH,
  } = options
  const normalizedQuery = normalizeSearchText(query)

  if (normalizedQuery.length < minLength) {
    return []
  }

  const tokens = tokenizeQuery(normalizedQuery)

  return index
    .map((entry) => ({
      entry,
      score: scoreEntry(entry, normalizedQuery, tokens),
    }))
    .filter(({ entry, score }) => score > 0 && entryMatchesTokens(entry, tokens))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }

      if (left.entry.moduleLabel !== right.entry.moduleLabel) {
        return left.entry.moduleLabel.localeCompare(right.entry.moduleLabel)
      }

      if (left.entry.title !== right.entry.title) {
        return left.entry.title.localeCompare(right.entry.title)
      }

      return left.entry.position - right.entry.position
    })
    .slice(0, limit)
    .map(({ entry, score }) => ({
      ...entry,
      score,
    }))
}

export default {
  buildSearchIndex,
  searchIndex,
  MIN_GLOBAL_SEARCH_LENGTH,
}
