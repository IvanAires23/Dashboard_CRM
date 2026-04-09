import { useAuthStore } from '../../store/auth.js'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)
  const status = useAuthStore((state) => state.status)
  const setSession = useAuthStore((state) => state.setSession)
  const clearSession = useAuthStore((state) => state.clearSession)
  const updateUser = useAuthStore((state) => state.updateUser)
  const setAuthLoading = useAuthStore((state) => state.setAuthLoading)
  const signIn = useAuthStore((state) => state.signIn)
  const signOut = useAuthStore((state) => state.signOut)

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    status,
    setSession,
    clearSession,
    updateUser,
    setAuthLoading,
    signIn,
    signOut,
  }
}
