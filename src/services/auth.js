import { get, post } from './http.js'
import { USER_ROLES } from '../lib/constants/userRoles.js'

const AUTH_BASE = '/auth'
const DEMO_EMAIL = 'email@email.com'
const DEMO_PASSWORD = '123456'
const USE_MOCK_AUTH = import.meta.env?.VITE_AUTH_MOCK !== 'false'

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function normalizeSession(payload = {}, fallbackEmail = DEMO_EMAIL) {
  const rawUser = payload.user

  return {
    token: payload.token ?? payload.accessToken ?? null,
    user: rawUser
      ? {
          ...rawUser,
          role: rawUser.role ?? USER_ROLES.MANAGER,
        }
      : {
          id: 'demo-user',
          name: 'Demo CRM User',
          email: fallbackEmail,
          role: USER_ROLES.MANAGER,
        },
  }
}

export async function login(credentials) {
  const email = credentials?.email?.trim() ?? ''
  const password = credentials?.password ?? ''

  if (USE_MOCK_AUTH) {
    await delay(350)

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      return normalizeSession({ token: 'demo-session-token' }, email)
    }

    const error = new Error('Invalid email or password. Please try again.')
    error.code = 'INVALID_CREDENTIALS'
    throw error
  }

  const payload = await post(`${AUTH_BASE}/login`, {
    email,
    password,
  })

  return normalizeSession(payload, email)
}

export async function logout() {
  if (USE_MOCK_AUTH) {
    await delay(120)
    return { success: true }
  }

  return post(`${AUTH_BASE}/logout`)
}

export function getSession() {
  return get(`${AUTH_BASE}/session`)
}

export function refreshSession(payload = {}) {
  return post(`${AUTH_BASE}/refresh`, payload)
}

export function requestPasswordReset(email) {
  return post(`${AUTH_BASE}/password/reset-request`, { email })
}

export function resetPassword(payload) {
  return post(`${AUTH_BASE}/password/reset`, payload)
}

export default {
  login,
  logout,
  getSession,
  refreshSession,
  requestPasswordReset,
  resetPassword,
}
