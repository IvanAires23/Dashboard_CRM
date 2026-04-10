import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authStatus, useAuthStore } from './auth.js'
import { login, logout } from '../services/auth.js'

vi.mock('../services/auth.js', () => ({
  login: vi.fn(),
  logout: vi.fn(),
}))

function resetAuthStore() {
  useAuthStore.setState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    status: authStatus.idle,
  })
}

describe('auth store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetAuthStore()
  })

  it('sets authenticated state on successful sign in', async () => {
    login.mockResolvedValue({
      token: 'session-token',
      user: {
        id: 'user-1',
        name: 'Demo User',
        email: 'email@email.com',
      },
    })

    await useAuthStore.getState().signIn({
      email: 'email@email.com',
      password: '123456',
    })

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.token).toBe('session-token')
    expect(state.user?.email).toBe('email@email.com')
    expect(state.status).toBe(authStatus.authenticated)
    expect(state.isLoading).toBe(false)
  })

  it('resets session and exposes unauthenticated status on failed sign in', async () => {
    login.mockRejectedValue(new Error('Invalid email or password. Please try again.'))

    await expect(
      useAuthStore.getState().signIn({
        email: 'wrong@email.com',
        password: 'wrong-pass',
      }),
    ).rejects.toThrow('Invalid email or password. Please try again.')

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.status).toBe(authStatus.unauthenticated)
    expect(state.isLoading).toBe(false)
  })

  it('clears authenticated session when signing out', async () => {
    useAuthStore.setState({
      user: { id: 'user-1', name: 'Demo User' },
      token: 'session-token',
      isAuthenticated: true,
      isLoading: false,
      status: authStatus.authenticated,
    })
    logout.mockResolvedValue({ success: true })

    await useAuthStore.getState().signOut()

    const state = useAuthStore.getState()
    expect(logout).toHaveBeenCalled()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.status).toBe(authStatus.unauthenticated)
  })
})
