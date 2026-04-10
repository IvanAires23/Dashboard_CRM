import { QueryClientProvider } from '@tanstack/react-query'
import ConfirmProvider from '../components/feedback/ConfirmProvider.jsx'
import ToastProvider from '../components/feedback/ToastProvider.jsx'
import { queryClient } from '../lib/react-query.js'

function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmProvider>
        <ToastProvider>{children}</ToastProvider>
      </ConfirmProvider>
    </QueryClientProvider>
  )
}

export default AppProviders
