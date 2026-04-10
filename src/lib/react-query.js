import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { reportError } from './errors/reportError.js'

function shouldReportGlobalError(entry) {
  return !entry?.meta?.disableGlobalErrorHandler
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (!shouldReportGlobalError(query)) {
        return
      }

      reportError(error, 'query', {
        queryKey: query?.queryKey,
      })
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (!shouldReportGlobalError(mutation)) {
        return
      }

      reportError(error, 'mutation', {
        mutationKey: mutation?.options?.mutationKey,
      })
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
