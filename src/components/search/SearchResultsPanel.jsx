import EmptyState from '../ui/EmptyState.jsx'

function groupByModule(results = []) {
  return results.reduce((groups, result) => {
    const moduleKey = result.moduleKey

    if (!groups[moduleKey]) {
      groups[moduleKey] = {
        moduleLabel: result.moduleLabel,
        items: [],
      }
    }

    groups[moduleKey].items.push(result)
    return groups
  }, {})
}

function SearchResultsPanel({
  isOpen = false,
  query = '',
  minQueryLength = 2,
  isLoading = false,
  errorMessage = '',
  results = [],
  onSelectResult = () => {},
  panelId = 'global-search-results',
  activeResultId = '',
  getResultOptionId = (result) => result?.id,
  onActivateResult = () => {},
}) {
  if (!isOpen) {
    return null
  }

  const trimmedQuery = query.trim()

  if (trimmedQuery.length < minQueryLength) {
    return (
      <div className="search-results-panel" id={panelId} role="status">
        <EmptyState
          contained={false}
          className="search-results-panel__empty-state"
          eyebrow="Search"
          title="Start typing to search CRM"
          description={`Type at least ${minQueryLength} characters to search leads, deals, accounts, contacts, and tasks.`}
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="search-results-panel" id={panelId} role="status">
        <EmptyState
          contained={false}
          className="search-results-panel__empty-state"
          eyebrow="Search"
          title="Searching CRM data"
          description="Gathering matching leads, deals, accounts, contacts, and tasks."
        />
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="search-results-panel" id={panelId} role="alert">
        <EmptyState
          contained={false}
          className="search-results-panel__empty-state"
          eyebrow="Search"
          title="Unable to search right now"
          description={errorMessage}
        />
      </div>
    )
  }

  if (!results.length) {
    return (
      <div className="search-results-panel" id={panelId} role="status">
        <EmptyState
          contained={false}
          className="search-results-panel__empty-state"
          eyebrow="Search"
          title="No matching results"
          description={`No CRM entities match "${trimmedQuery}". Try a different name, account, or status.`}
        />
      </div>
    )
  }

  const groupedResults = Object.values(groupByModule(results))

  return (
    <div
      className="search-results-panel"
      id={panelId}
      role="listbox"
      aria-label="Global search results"
    >
      <div className="search-results-panel__header">
        <span>{results.length} result{results.length === 1 ? '' : 's'}</span>
      </div>

      <div className="search-results-panel__groups">
        {groupedResults.map((group) => (
          <section
            key={group.moduleLabel}
            className="search-results-panel__group"
            role="group"
            aria-label={group.moduleLabel}
          >
            <h3>{group.moduleLabel}</h3>

            {group.items.map((result) => (
              <button
                key={`${result.moduleKey}-${result.id}`}
                type="button"
                className="search-result-row"
                onClick={() => onSelectResult(result)}
                onMouseEnter={() => onActivateResult(getResultOptionId(result))}
                id={getResultOptionId(result)}
                role="option"
                aria-selected={activeResultId === getResultOptionId(result)}
              >
                <div className="search-result-row__title-wrap">
                  <span className="search-result-row__title">{result.title}</span>
                  <span className="search-result-row__badge">{result.moduleLabel}</span>
                </div>
                {result.subtitle ? <span className="search-result-row__subtitle">{result.subtitle}</span> : null}
                {result.meta ? <span className="search-result-row__meta">{result.meta}</span> : null}
              </button>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}

export default SearchResultsPanel
