import AppProviders from './providers.jsx'
import AppRoutes from '../routes/AppRoutes.jsx'

function AppShell() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  )
}

export default AppShell
