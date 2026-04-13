import { del, get, patch, post } from './http.js'
import { withCrmFallback } from './mockFallback.js'
import { mockCrmStore } from './mockCrmStore.js'

const ACCOUNTS_BASE = '/accounts'

export function getAccounts(filters = {}) {
  return withCrmFallback(
    () => get(ACCOUNTS_BASE, { query: filters }),
    () => mockCrmStore.getAccounts(filters),
  )
}

export function getAccountById(accountId) {
  return withCrmFallback(
    () => get(`${ACCOUNTS_BASE}/${accountId}`),
    () => mockCrmStore.getAccountById(accountId),
  )
}

export function createAccount(payload) {
  return withCrmFallback(
    () => post(ACCOUNTS_BASE, payload),
    () => mockCrmStore.createAccount(payload),
  )
}

export function updateAccount(accountId, payload) {
  return withCrmFallback(
    () => patch(`${ACCOUNTS_BASE}/${accountId}`, payload),
    () => mockCrmStore.updateAccount(accountId, payload),
  )
}

export function deleteAccount(accountId) {
  return withCrmFallback(
    () => del(`${ACCOUNTS_BASE}/${accountId}`),
    () => mockCrmStore.deleteAccount(accountId),
  )
}

export function getAccountContacts(accountId, filters = {}) {
  return withCrmFallback(
    () => get(`${ACCOUNTS_BASE}/${accountId}/contacts`, { query: filters }),
    () => mockCrmStore.getAccountContacts(accountId, filters),
  )
}

export function getAccountMetrics(accountId, filters = {}) {
  return withCrmFallback(
    () => get(`${ACCOUNTS_BASE}/${accountId}/metrics`, { query: filters }),
    () => mockCrmStore.getAccountMetrics(accountId, filters),
  )
}

export default {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountContacts,
  getAccountMetrics,
}
