import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

function normalizeDefaults(defaultFilters = {}) {
  return Object.entries(defaultFilters).reduce((accumulator, [key, value]) => {
    accumulator[key] = value === undefined || value === null ? '' : String(value)
    return accumulator
  }, {})
}

function mergeFiltersWithDefaults(defaultFilters, searchParams) {
  return Object.keys(defaultFilters).reduce((accumulator, key) => {
    const paramValue = searchParams.get(key)
    accumulator[key] = paramValue === null ? defaultFilters[key] : paramValue
    return accumulator
  }, {})
}

export function useUrlFilters(defaultFiltersInput = {}) {
  const defaultFilters = useMemo(
    () => normalizeDefaults(defaultFiltersInput),
    [defaultFiltersInput],
  )
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(
    () => mergeFiltersWithDefaults(defaultFilters, searchParams),
    [defaultFilters, searchParams],
  )

  const setFilter = (key, value, options = {}) => {
    const {
      resetPage = key !== 'page',
      pageKey = 'page',
    } = options

    setSearchParams((currentSearchParams) => {
      const nextSearchParams = new URLSearchParams(currentSearchParams)
      const normalizedValue = value === undefined || value === null ? '' : String(value)
      const defaultValue = defaultFilters[key] ?? ''

      if (!normalizedValue || normalizedValue === defaultValue) {
        nextSearchParams.delete(key)
      } else {
        nextSearchParams.set(key, normalizedValue)
      }

      if (resetPage) {
        const defaultPage = defaultFilters[pageKey] ?? '1'
        nextSearchParams.set(pageKey, defaultPage)
      }

      return nextSearchParams
    })
  }

  const setFilters = (nextFilters = {}, options = {}) => {
    const {
      resetPage = true,
      pageKey = 'page',
    } = options

    setSearchParams((currentSearchParams) => {
      const nextSearchParams = new URLSearchParams(currentSearchParams)

      Object.entries(nextFilters).forEach(([key, value]) => {
        const normalizedValue = value === undefined || value === null ? '' : String(value)
        const defaultValue = defaultFilters[key] ?? ''
        if (!normalizedValue || normalizedValue === defaultValue) {
          nextSearchParams.delete(key)
        } else {
          nextSearchParams.set(key, normalizedValue)
        }
      })

      if (resetPage) {
        const defaultPage = defaultFilters[pageKey] ?? '1'
        nextSearchParams.set(pageKey, defaultPage)
      }

      return nextSearchParams
    })
  }

  const resetFilters = () => {
    const normalizedFilters = Object.entries(defaultFilters).reduce((accumulator, [key, value]) => {
      accumulator[key] = value
      return accumulator
    }, {})

    setFilters(normalizedFilters, { resetPage: false })
  }

  const currentPage = Math.max(1, Number.parseInt(filters.page || '1', 10) || 1)

  const setCurrentPage = (nextPage) => {
    const parsedPage = Math.max(1, Number.parseInt(String(nextPage), 10) || 1)
    setFilter('page', String(parsedPage), {
      resetPage: false,
    })
  }

  return {
    filters,
    setFilter,
    setFilters,
    resetFilters,
    currentPage,
    setCurrentPage,
  }
}

export default useUrlFilters
