import { useUrlFilters } from '../../../lib/filters/useUrlFilters.js'

const defaultLeadFilters = Object.freeze({
  page: '1',
  q: '',
  status: 'all',
  source: 'all',
  sortBy: 'name',
  sortDir: 'asc',
})

export function useLeadFilters() {
  return useUrlFilters(defaultLeadFilters)
}

export default useLeadFilters
