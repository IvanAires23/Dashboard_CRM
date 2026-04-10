import { useUrlFilters } from '../../../lib/filters/useUrlFilters.js'

const defaultTaskFilters = Object.freeze({
  page: '1',
  q: '',
  status: 'all',
  priority: 'all',
  owner: 'all',
  dueFrom: '',
  dueTo: '',
  sortBy: 'dueDate',
  sortDir: 'asc',
})

export function useTaskFilters() {
  return useUrlFilters(defaultTaskFilters)
}

export default useTaskFilters
