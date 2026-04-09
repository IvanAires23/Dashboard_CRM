import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../app/layout.jsx'
import { useAuth } from '../features/auth/useAuth.js'
import AccessDeniedPage from '../features/system/pages/AccessDeniedPage.jsx'
import NotFoundPage from '../features/system/pages/NotFoundPage.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import { privateRoutes, publicRoutes } from './routeConfig.jsx'

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : route.element}
        />
      ))}

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="/access-denied" element={<AccessDeniedPage />} />

          {privateRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute requiredModule={route.moduleKey}>
                  {route.element}
                </ProtectedRoute>
              }
            />
          ))}
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
