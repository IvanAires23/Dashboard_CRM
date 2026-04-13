import { del, get, patch, post } from './http.js'
import { withCrmFallback } from './mockFallback.js'
import { mockCrmStore } from './mockCrmStore.js'

const LEADS_BASE = '/leads'

export function getLeads(filters = {}) {
  return withCrmFallback(
    () => get(LEADS_BASE, { query: filters }),
    () => mockCrmStore.getLeads(filters),
  )
}

export function getLeadById(leadId) {
  return withCrmFallback(
    () => get(`${LEADS_BASE}/${leadId}`),
    () => mockCrmStore.getLeadById(leadId),
  )
}

export function createLead(payload) {
  return withCrmFallback(
    () => post(LEADS_BASE, payload),
    () => mockCrmStore.createLead(payload),
  )
}

export function updateLead(leadId, payload) {
  return withCrmFallback(
    () => patch(`${LEADS_BASE}/${leadId}`, payload),
    () => mockCrmStore.updateLead(leadId, payload),
  )
}

export function deleteLead(leadId) {
  return withCrmFallback(
    () => del(`${LEADS_BASE}/${leadId}`),
    () => mockCrmStore.deleteLead(leadId),
  )
}

export function convertLead(leadId, payload = {}) {
  return withCrmFallback(
    () => post(`${LEADS_BASE}/${leadId}/convert`, payload),
    () => mockCrmStore.convertLead(leadId, payload),
  )
}

export function getLeadActivities(leadId, filters = {}) {
  return withCrmFallback(
    () => get(`${LEADS_BASE}/${leadId}/activities`, { query: filters }),
    () => mockCrmStore.getLeadActivities(leadId, filters),
  )
}

export default {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  convertLead,
  getLeadActivities,
}
