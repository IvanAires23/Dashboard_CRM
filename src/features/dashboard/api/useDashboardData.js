import { useQuery } from '@tanstack/react-query'
import { getDashboardOverview } from '../../../services/dashboard.js'

export const DASHBOARD_OVERVIEW_QUERY_KEY = ['dashboard', 'overview']

export function useDashboardData(queryOptions = {}) {
  return useQuery({
    queryKey: DASHBOARD_OVERVIEW_QUERY_KEY,
    queryFn: getDashboardOverview,
    ...queryOptions,
  })
}
