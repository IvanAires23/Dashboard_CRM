import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/layout/Header.jsx'
import Sidebar from '../components/layout/Sidebar.jsx'
import { appNavigation, privateRoutes } from '../routes/routeConfig.jsx'
import './layout.css'

function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const location = useLocation()
  const activeRoute = privateRoutes.find((route) => route.path === location.pathname)

  return (
    <div className={`app-layout app-shell${isSidebarCollapsed ? ' is-sidebar-collapsed' : ''}`}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        navigationItems={appNavigation}
        onToggle={() => setIsSidebarCollapsed((value) => !value)}
      />

      <div className="app-main-shell">
        <Header
          title={activeRoute?.title ?? 'CRM'}
          subtitle={activeRoute?.subtitle ?? ''}
          actionLabel="New record"
        />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
