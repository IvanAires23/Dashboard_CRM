import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { canAccessModule } from '../lib/auth/rolePermissions.js'
import { useAuthStore } from '../store/auth.js'

function ProtectedRoute({ children, requiredModule }) {
  const { isAuthenticated, user } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }))
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (requiredModule && !canAccessModule(user, requiredModule)) {
    return (
      <Navigate
        to="/access-denied"
        replace
        state={{ from: location, requiredModule }}
      />
    )
  }

  return children ?? <Outlet />
}

export default ProtectedRoute
