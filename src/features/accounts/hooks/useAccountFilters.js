import { useUrlFilters } from '../../../lib/filters/useUrlFilters.js'

const defaultAccountFilters = Object.freeze({
  page: '1',
  q: '',
  industry: 'all',
  sortBy: 'name',
  sortDir: 'asc',
})

export function useAccountFilters() {
  return useUrlFilters(defaultAccountFilters)
}

export default useAccountFilters
