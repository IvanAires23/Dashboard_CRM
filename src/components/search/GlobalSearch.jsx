import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQueries } from '@tanstack/react-query'
import { CRM_SEARCH_SOURCES, mapPayloadToSearchEntities } from '../../lib/search/searchEntities.js'
import { buildSearchIndex, MIN_GLOBAL_SEARCH_LENGTH, searchIndex } from '../../lib/search/searchIndex.js'
import { getErrorMessage } from '../../lib/errors/normalizeError.js'
import SearchResultsPanel from './SearchResultsPanel.jsx'
import './search.css'

function useDebouncedValue(value, delay = 180) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [value, delay])

  return debouncedValue
}

function GlobalSearch() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const resultsPanelId = useId()

  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const debouncedQuery = useDebouncedValue(query)
  const trimmedQuery = debouncedQuery.trim()
  const shouldFetchData = isOpen && trimmedQuery.length >= MIN_GLOBAL_SEARCH_LENGTH

  const searchQueries = useQueries({
    queries: CRM_SEARCH_SOURCES.map((source) => ({
      queryKey: source.queryKey,
      queryFn: source.queryFn,
      enabled: shouldFetchData,
      staleTime: 60_000,
    })),
  })

  const indexedEntities = useMemo(() => {
    const entities = CRM_SEARCH_SOURCES.flatMap((source, sourceIndex) => {
      return mapPayloadToSearchEntities(source, searchQueries[sourceIndex]?.data)
    })

    return buildSearchIndex(entities)
  }, [searchQueries])

  const searchResults = useMemo(() => {
    return searchIndex(indexedEntities, trimmedQuery, {
      limit: 24,
      minLength: MIN_GLOBAL_SEARCH_LENGTH,
    })
  }, [indexedEntities, trimmedQuery])
  const searchResultsWithIds = useMemo(() => {
    return searchResults.map((result, index) => {
      const rawId = `${result.moduleKey}-${result.id}-${index}`
      const normalizedId = rawId.replace(/[^a-zA-Z0-9-_]/g, '-')

      return {
        ...result,
        optionId: `search-option-${normalizedId}`,
      }
    })
  }, [searchResults])

  const isLoading = shouldFetchData && searchQueries.some((queryResult) => queryResult.isPending)
  const failedQueries = searchQueries.filter((queryResult) => queryResult.isError)
  const errorMessage =
    shouldFetchData && failedQueries.length === searchQueries.length
      ? getErrorMessage(failedQueries[0]?.error, 'Unable to search CRM data right now.')
      : ''

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
        setActiveIndex(-1)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
    }
  }, [isOpen])

  const handleSelectResult = (result) => {
    setIsOpen(false)
    setActiveIndex(-1)
    navigate(result.href)
    setQuery('')
  }

  const handleClear = () => {
    setQuery('')
    setActiveIndex(-1)
    inputRef.current?.focus()
  }

  const activeOptionId = activeIndex >= 0 ? searchResultsWithIds[activeIndex]?.optionId : ''

  useEffect(() => {
    if (!activeOptionId) {
      return
    }

    const optionElement = document.getElementById(activeOptionId)
    optionElement?.scrollIntoView({ block: 'nearest' })
  }, [activeOptionId])

  return (
    <div ref={containerRef} className="global-search">
      <div className="toolbar-search global-search__input-wrap">
        <Search size={16} strokeWidth={2} />
        <input
          ref={inputRef}
          value={query}
          aria-label="Search CRM entities"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={resultsPanelId}
          aria-activedescendant={activeOptionId || undefined}
          aria-haspopup="listbox"
          placeholder="Search CRM data..."
          type="text"
          onFocus={() => {
            setIsOpen(true)
          }}
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
            setActiveIndex(-1)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setIsOpen(false)
              setActiveIndex(-1)
              inputRef.current?.blur()
              return
            }

            if (event.key === 'ArrowDown') {
              if (!searchResultsWithIds.length) {
                return
              }

              event.preventDefault()
              setIsOpen(true)
              setActiveIndex((previousIndex) => {
                const nextIndex = previousIndex + 1
                return nextIndex >= searchResultsWithIds.length ? 0 : nextIndex
              })
              return
            }

            if (event.key === 'ArrowUp') {
              if (!searchResultsWithIds.length) {
                return
              }

              event.preventDefault()
              setIsOpen(true)
              setActiveIndex((previousIndex) => {
                if (previousIndex <= 0) {
                  return searchResultsWithIds.length - 1
                }

                return previousIndex - 1
              })
              return
            }

            if (event.key === 'Enter' && activeIndex >= 0 && searchResultsWithIds[activeIndex]) {
              event.preventDefault()
              handleSelectResult(searchResultsWithIds[activeIndex])
            }
          }}
        />
        {query ? (
          <button
            aria-label="Clear search"
            className="global-search__clear"
            onClick={handleClear}
            type="button"
          >
            <X size={14} strokeWidth={2} />
          </button>
        ) : null}
      </div>

      <SearchResultsPanel
        panelId={resultsPanelId}
        isOpen={isOpen}
        query={query}
        minQueryLength={MIN_GLOBAL_SEARCH_LENGTH}
        isLoading={isLoading}
        errorMessage={errorMessage}
        results={searchResultsWithIds}
        activeResultId={activeOptionId}
        getResultOptionId={(result) => result.optionId}
        onActivateResult={(optionId) => {
          const nextIndex = searchResultsWithIds.findIndex((result) => result.optionId === optionId)
          setActiveIndex(nextIndex)
        }}
        onSelectResult={handleSelectResult}
      />
    </div>
  )
}

export default GlobalSearch
