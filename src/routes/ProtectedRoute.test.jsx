import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { screen } from '@testing-library/react'
import ProtectedRoute from './ProtectedRoute.jsx'
import { USER_ROLES } from '../lib/constants/userRoles.js'
import { useAuthStore } from '../store/auth.js'
import { renderWithProviders } from '../test/renderWithProviders.jsx'

function renderProtectedRoute({
  initialPath = '/secure',
  requiredModule,
} = {}) {
  return renderWithProviders(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<h1>Login page</h1>} />
        <Route path="/access-denied" element={<h1>Access denied</h1>} />
        <Route
          path="/secure"
          element={(
            <ProtectedRoute requiredModule={requiredModule}>
              <h1>Secure page</h1>
            </ProtectedRoute>
          )}
        />
      </Routes>
    </MemoryRouter>,
    {
      withRouter: false,
      withFeedbackProviders: false,
      withQueryClient: false,
    },
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      status: 'idle',
    })
  })

  it('redirects unauthenticated users to login', () => {
    renderProtectedRoute()

    expect(screen.getByRole('heading', { name: 'Login page' })).toBeInTheDocument()
  })

  it('renders protected content for authenticated users', () => {
    useAuthStore.setState({
      user: {
        id: 'user-1',
        name: 'Manager',
        role: USER_ROLES.MANAGER,
      },
      token: 'token',
      isAuthenticated: true,
    })

    renderProtectedRoute()

    expect(screen.getByRole('heading', { name: 'Secure page' })).toBeInTheDocument()
  })

  it('redirects to access denied when module permission is missing', () => {
    useAuthStore.setState({
      user: {
        id: 'user-2',
        name: 'Support',
        role: USER_ROLES.SUPPORT,
      },
      token: 'token',
      isAuthenticated: true,
    })

    renderProtectedRoute({ requiredModule: 'deals' })

    expect(screen.getByRole('heading', { name: 'Access denied' })).toBeInTheDocument()
  })
})
