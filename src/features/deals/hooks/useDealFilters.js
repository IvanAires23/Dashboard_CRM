import { useUrlFilters } from '../../../lib/filters/useUrlFilters.js'

const defaultDealFilters = Object.freeze({
  page: '1',
  q: '',
  stage: 'all',
  owner: 'all',
  closeFrom: '',
  closeTo: '',
  sortBy: 'value',
  sortDir: 'desc',
})

export function useDealFilters() {
  return useUrlFilters(defaultDealFilters)
}

export default useDealFilters
