import { del, get, patch, post } from './http.js'

const ACCOUNTS_BASE = '/accounts'

export function getAccounts(filters = {}) {
  return get(ACCOUNTS_BASE, { query: filters })
}

export function getAccountById(accountId) {
  return get(`${ACCOUNTS_BASE}/${accountId}`)
}

export function createAccount(payload) {
  return post(ACCOUNTS_BASE, payload)
}

export function updateAccount(accountId, payload) {
  return patch(`${ACCOUNTS_BASE}/${accountId}`, payload)
}

export function deleteAccount(accountId) {
  return del(`${ACCOUNTS_BASE}/${accountId}`)
}

export function getAccountContacts(accountId, filters = {}) {
  return get(`${ACCOUNTS_BASE}/${accountId}/contacts`, { query: filters })
}

export function getAccountMetrics(accountId, filters = {}) {
  return get(`${ACCOUNTS_BASE}/${accountId}/metrics`, { query: filters })
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
