import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../app/layout.jsx'
import NotFoundPage from '../features/system/pages/NotFoundPage.jsx'
import { privateRoutes, publicRoutes } from './routeConfig.jsx'

function AppRoutes() {
  return (
    <Routes>
      {publicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        {privateRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
