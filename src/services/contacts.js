import { del, get, patch, post } from './http.js'

const CONTACTS_BASE = '/contacts'

export function getContacts(filters = {}) {
  return get(CONTACTS_BASE, { query: filters })
}

export function getContactById(contactId) {
  return get(`${CONTACTS_BASE}/${contactId}`)
}

export function createContact(payload) {
  return post(CONTACTS_BASE, payload)
}

export function updateContact(contactId, payload) {
  return patch(`${CONTACTS_BASE}/${contactId}`, payload)
}

export function deleteContact(contactId) {
  return del(`${CONTACTS_BASE}/${contactId}`)
}

export function getContactInteractions(contactId, filters = {}) {
  return get(`${CONTACTS_BASE}/${contactId}/interactions`, { query: filters })
}

export function addContactInteraction(contactId, payload) {
  return post(`${CONTACTS_BASE}/${contactId}/interactions`, payload)
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
