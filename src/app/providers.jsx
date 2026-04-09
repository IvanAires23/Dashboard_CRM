import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/react-query.js'

function AppProviders({ children }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default AppProviders
