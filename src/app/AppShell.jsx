import AppProviders from './providers.jsx'
import ErrorBoundary from '../components/system/ErrorBoundary.jsx'
import AppRoutes from '../routes/AppRoutes.jsx'

function AppShell() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </ErrorBoundary>
  )
}

export default AppShell
