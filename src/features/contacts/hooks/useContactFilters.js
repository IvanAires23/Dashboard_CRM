import { useUrlFilters } from '../../../lib/filters/useUrlFilters.js'

const defaultContactFilters = Object.freeze({
  page: '1',
  q: '',
  account: 'all',
  sortBy: 'name',
  sortDir: 'asc',
})

export function useContactFilters() {
  return useUrlFilters(defaultContactFilters)
}

export default useContactFilters
