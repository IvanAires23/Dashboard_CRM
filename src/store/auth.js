import { create } from 'zustand'
import { login as loginRequest, logout as logoutRequest } from '../services/auth.js'

export const authStatus = {
  idle: 'idle',
  loading: 'loading',
  authenticated: 'authenticated',
  unauthenticated: 'unauthenticated',
}

const initialAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  status: authStatus.idle,
}

function resolveNextStatus(isLoading, isAuthenticated) {
  if (isLoading) {
    return authStatus.loading
  }

  return isAuthenticated ? authStatus.authenticated : authStatus.unauthenticated
}

export const useAuthStore = create((set) => ({
  ...initialAuthState,

  setAuthLoading: (value) =>
    set((state) => ({
      isLoading: value,
      status: resolveNextStatus(value, state.isAuthenticated),
    })),

  setSession: (session = {}) => {
    const nextUser = session.user ?? null
    const nextToken = session.token ?? null
    const hasSession = Boolean(nextUser || nextToken)

    set({
      user: nextUser,
      token: nextToken,
      isAuthenticated: hasSession,
      isLoading: false,
      status: resolveNextStatus(false, hasSession),
    })
  },

  clearSession: () =>
    set({
      ...initialAuthState,
      status: authStatus.unauthenticated,
    }),

  updateUser: (payload) =>
    set((state) => {
      if (!state.user) {
        return state
      }

      const nextUser =
        typeof payload === 'function'
          ? payload(state.user)
          : { ...state.user, ...payload }

      return { user: nextUser }
    }),

  signIn: async (credentials) => {
    set((state) => ({
      isLoading: true,
      status: resolveNextStatus(true, state.isAuthenticated),
    }))

    try {
      const session = await loginRequest(credentials)
      const nextUser = session?.user ?? null
      const nextToken = session?.token ?? null
      const hasSession = Boolean(nextUser || nextToken)

      if (!hasSession) {
        throw new Error('Authentication failed. Please try again.')
      }

      set({
        user: nextUser,
        token: nextToken,
        isAuthenticated: true,
        isLoading: false,
        status: authStatus.authenticated,
      })

      return session
    } catch (error) {
      set({
        ...initialAuthState,
        isLoading: false,
        status: authStatus.unauthenticated,
      })
      throw error
    }
  },

  signOut: async () => {
    try {
      await logoutRequest()
    } finally {
      set({
        ...initialAuthState,
        status: authStatus.unauthenticated,
      })
    }
  },
}))

export default useAuthStore
