import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import AppRoutes from './AppRoutes.jsx'
import { renderWithProviders } from '../test/renderWithProviders.jsx'
import { useAuth } from '../features/auth/useAuth.js'

vi.mock('../features/auth/useAuth.js', () => ({
  useAuth: vi.fn(),
}))

vi.mock('./ProtectedRoute.jsx', async () => {
  const { Outlet } = await import('react-router-dom')

  return {
    default: ({ children }) => children ?? <Outlet />,
  }
})

vi.mock('../app/layout.jsx', async () => {
  const { Outlet } = await import('react-router-dom')

  return {
    default: () => (
      <div data-testid="app-layout-shell">
        <p>App layout shell</p>
        <Outlet />
      </div>
    ),
  }
})

vi.mock('./routeConfig.jsx', async () => {
  const React = await import('react')

  return {
    publicRoutes: [
      {
        path: '/login',
        element: React.createElement('h1', null, 'Login page'),
      },
    ],
    privateRoutes: [
      {
        path: '/dashboard',
        moduleKey: 'dashboard',
        label: 'Overview',
        title: 'Dashboard',
        subtitle: 'Dashboard subtitle',
        element: React.createElement('h1', null, 'Dashboard page'),
        end: true,
      },
    ],
  }
})

function renderAppRoutes(initialPath) {
  return renderWithProviders(
    <MemoryRouter initialEntries={[initialPath]}>
      <AppRoutes />
    </MemoryRouter>,
    {
      withRouter: false,
    },
  )
}

describe('AppRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders expected content for known private route', () => {
    useAuth.mockReturnValue({ isAuthenticated: true })

    renderAppRoutes('/dashboard')

    expect(screen.getByText('App layout shell')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dashboard page' })).toBeInTheDocument()
  })

  it('renders expected content for known public route when unauthenticated', () => {
    useAuth.mockReturnValue({ isAuthenticated: false })

    renderAppRoutes('/login')

    expect(screen.getByRole('heading', { name: 'Login page' })).toBeInTheDocument()
  })

  it('renders not-found page for unknown route', () => {
    useAuth.mockReturnValue({ isAuthenticated: true })

    renderAppRoutes('/unknown-route')

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
