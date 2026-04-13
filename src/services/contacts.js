import { del, get, patch, post } from './http.js'
import { withCrmFallback } from './mockFallback.js'
import { mockCrmStore } from './mockCrmStore.js'

const CONTACTS_BASE = '/contacts'

export function getContacts(filters = {}) {
  return withCrmFallback(
    () => get(CONTACTS_BASE, { query: filters }),
    () => mockCrmStore.getContacts(filters),
  )
}

export function getContactById(contactId) {
  return withCrmFallback(
    () => get(`${CONTACTS_BASE}/${contactId}`),
    () => mockCrmStore.getContactById(contactId),
  )
}

export function createContact(payload) {
  return withCrmFallback(
    () => post(CONTACTS_BASE, payload),
    () => mockCrmStore.createContact(payload),
  )
}

export function updateContact(contactId, payload) {
  return withCrmFallback(
    () => patch(`${CONTACTS_BASE}/${contactId}`, payload),
    () => mockCrmStore.updateContact(contactId, payload),
  )
}

export function deleteContact(contactId) {
  return withCrmFallback(
    () => del(`${CONTACTS_BASE}/${contactId}`),
    () => mockCrmStore.deleteContact(contactId),
  )
}

export function getContactInteractions(contactId, filters = {}) {
  return withCrmFallback(
    () => get(`${CONTACTS_BASE}/${contactId}/interactions`, { query: filters }),
    () => mockCrmStore.getContactInteractions(contactId, filters),
  )
}

export function addContactInteraction(contactId, payload) {
  return withCrmFallback(
    () => post(`${CONTACTS_BASE}/${contactId}/interactions`, payload),
    () => mockCrmStore.addContactInteraction(contactId, payload),
  )
}

export default {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  getContactInteractions,
  addContactInteraction,
}
