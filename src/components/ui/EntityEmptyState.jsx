import { Link } from 'react-router-dom'
import EmptyState from './EmptyState.jsx'

function toSingular(label) {
  const normalized = String(label || 'record').trim().toLowerCase()

  if (normalized.endsWith('ies')) {
    return `${normalized.slice(0, -3)}y`
  }

  if (normalized.endsWith('s')) {
    return normalized.slice(0, -1)
  }

  return normalized
}

function EntityEmptyState({
  entityLabel = 'records',
  hasFilters = false,
  onClearFilters = null,
  clearLabel = 'Clear filters',
  createHref = '',
  createLabel = '',
  title,
  description,
  eyebrow = 'Empty',
  className,
}) {
  const normalizedEntityLabel = String(entityLabel || 'records').toLowerCase()
  const singularEntityLabel = toSingular(normalizedEntityLabel)

  const computedTitle = hasFilters
    ? title || `No ${normalizedEntityLabel} match the current filters`
    : title || `No ${normalizedEntityLabel} yet`

  const computedDescription = hasFilters
    ? description || `Try adjusting search terms or filters to find ${normalizedEntityLabel}.`
    : description || `Create your first ${singularEntityLabel} to start tracking this module.`

  const action = hasFilters && onClearFilters
    ? (
      <button type="button" className="state-action" onClick={onClearFilters}>
        {clearLabel}
      </button>
      )
    : createHref && createLabel
      ? (
        <Link className="state-action" to={createHref}>
          {createLabel}
        </Link>
        )
      : null

  return (
    <EmptyState
      contained={false}
      eyebrow={eyebrow}
      title={computedTitle}
      description={computedDescription}
      className={className}
      action={action}
    />
  )
}

export default EntityEmptyState
