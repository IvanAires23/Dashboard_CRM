import { useAuthStore } from '../../store/auth.js'

export function useAuth() {
  const session = useAuthStore((state) => ({
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    status: state.status,
    setSession: state.setSession,
    clearSession: state.clearSession,
    updateUser: state.updateUser,
    setAuthLoading: state.setAuthLoading,
    signIn: state.signIn,
    signOut: state.signOut,
  }))

  return session
}
