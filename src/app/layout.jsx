import { useEffect, useId, useState } from 'react'
import { matchPath, Outlet, useLocation } from 'react-router-dom'
import Header from '../components/layout/Header.jsx'
import Sidebar from '../components/layout/Sidebar.jsx'
import { appNavigation, privateRoutes } from '../routes/routeConfig.jsx'
import './layout.css'

const MOBILE_BREAKPOINT_PX = 960

function getInitialIsMobileViewport() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`).matches
}

function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(getInitialIsMobileViewport)
  const location = useLocation()
  const baseId = useId().replace(/:/g, '')
  const pageHeadingId = `app-page-heading-${baseId}`
  const contentId = `app-main-content-${baseId}`

  const activeRoute = privateRoutes.find((route) =>
    matchPath({ path: route.path, end: route.end ?? true }, location.pathname),
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`)
    const handleChange = (event) => {
      setIsMobileViewport(event.matches)

      if (!event.matches) {
        setIsMobileSidebarOpen(false)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  useEffect(() => {
    if (!isMobileViewport || !isMobileSidebarOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileViewport, isMobileSidebarOpen])

  useEffect(() => {
    if (!isMobileViewport || !isMobileSidebarOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMobileSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileViewport, isMobileSidebarOpen])

  const isCollapsed = isMobileViewport ? false : isSidebarCollapsed

  const handleSidebarToggle = () => {
    if (isMobileViewport) {
      setIsMobileSidebarOpen((value) => !value)
      return
    }

    setIsSidebarCollapsed((value) => !value)
  }

  return (
    <div
      className={`app-layout app-shell${isCollapsed ? ' is-sidebar-collapsed' : ''}${isMobileViewport ? ' is-mobile-viewport' : ''}${isMobileSidebarOpen ? ' is-mobile-sidebar-open' : ''}`}
    >
      <a className="skip-link" href={`#${contentId}`}>
        Skip to main content
      </a>

      <Sidebar
        isCollapsed={isCollapsed}
        isMobileViewport={isMobileViewport}
        isMobileOpen={isMobileSidebarOpen}
        navigationItems={appNavigation}
        onToggle={handleSidebarToggle}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {isMobileViewport && isMobileSidebarOpen ? (
        <button
          type="button"
          className="app-shell__backdrop"
          aria-label="Close navigation menu"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      ) : null}

      <div className="app-main-shell">
        <Header
          title={activeRoute?.title ?? 'CRM'}
          subtitle={activeRoute?.subtitle ?? ''}
          headingId={pageHeadingId}
          onMenuToggle={handleSidebarToggle}
          showMenuButton={isMobileViewport}
        />

        <main className="app-content" id={contentId} aria-labelledby={pageHeadingId} tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
