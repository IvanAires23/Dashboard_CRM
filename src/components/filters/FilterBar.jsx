import './filters.css'

function FilterBar({
  children,
  actions = null,
  onClear = null,
  canClear = true,
  clearLabel = 'Clear filters',
}) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__fields">{children}</div>

      <div className="filter-bar__actions">
        <div>
          {onClear ? (
            <button
              type="button"
              className="filter-bar__clear"
              disabled={!canClear}
              onClick={onClear}
            >
              {clearLabel}
            </button>
          ) : null}
        </div>
        <div className="filter-bar__action-group">{actions}</div>
      </div>
    </div>
  )
}

export default FilterBar
