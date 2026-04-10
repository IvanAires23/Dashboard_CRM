import { useQuery } from '@tanstack/react-query'
import { getAccounts } from '../../../services/accounts.js'
import { getContacts } from '../../../services/contacts.js'
import { getDeals } from '../../../services/deals.js'
import { getLeads } from '../../../services/leads.js'
import { getTasks } from '../../../services/tasks.js'
import { extractCollection } from '../../../lib/crm/entityUtils.js'
import { mapDashboardViewModel } from '../lib/dashboardMappers.js'
import { DASHBOARD_MOCK_DOMAIN_DATA } from './dashboardMockData.js'

export const DASHBOARD_QUERY_KEY = ['dashboard', 'crm-overview']
const DASHBOARD_ENTITY_KEYS = Object.freeze(['deals', 'leads', 'accounts', 'contacts', 'tasks'])

function isDashboardMockEnabled() {
  return import.meta.env?.VITE_DASHBOARD_MOCK === 'true'
}

function getDashboardTotalRecords(domainData = {}) {
  return DASHBOARD_ENTITY_KEYS.reduce((total, key) => {
    const entries = Array.isArray(domainData[key]) ? domainData[key] : []
    return total + entries.length
  }, 0)
}

async function fetchDashboardDomainData() {
  const requests = [
    { key: 'deals', request: () => getDeals({ pageSize: 200 }) },
    { key: 'leads', request: () => getLeads({ pageSize: 200 }) },
    { key: 'accounts', request: () => getAccounts({ pageSize: 200 }) },
    { key: 'contacts', request: () => getContacts({ pageSize: 200 }) },
    { key: 'tasks', request: () => getTasks({ pageSize: 200 }) },
  ]

  const settledResponses = await Promise.allSettled(
    requests.map((requestConfig) => requestConfig.request()),
  )

  const failedResponses = settledResponses.filter((result) => result.status === 'rejected')
  if (failedResponses.length === settledResponses.length) {
    const fallbackError = new Error('Unable to load dashboard CRM data.')
    throw failedResponses[0].reason ?? fallbackError
  }

  return requests.reduce((accumulator, requestConfig, index) => {
    const result = settledResponses[index]
    if (result.status === 'fulfilled') {
      accumulator[requestConfig.key] = extractCollection(result.value)
      return accumulator
    }

    accumulator[requestConfig.key] = []
    return accumulator
  }, {})
}

export function useDashboardQuery(queryOptions = {}) {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: async () => {
      const shouldUseMock = isDashboardMockEnabled()
      let dashboardDomainData

      try {
        dashboardDomainData = await fetchDashboardDomainData()
      } catch (error) {
        if (!shouldUseMock) {
          throw error
        }

        dashboardDomainData = DASHBOARD_MOCK_DOMAIN_DATA
      }

      if (shouldUseMock && getDashboardTotalRecords(dashboardDomainData) === 0) {
        dashboardDomainData = DASHBOARD_MOCK_DOMAIN_DATA
      }

      return mapDashboardViewModel(dashboardDomainData)
    },
    ...queryOptions,
  })
}

export default useDashboardQuery
