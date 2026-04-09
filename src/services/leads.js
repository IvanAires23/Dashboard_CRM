import { del, get, patch, post } from './http.js'

const LEADS_BASE = '/leads'

export function getLeads(filters = {}) {
  return get(LEADS_BASE, { query: filters })
}

export function getLeadById(leadId) {
  return get(`${LEADS_BASE}/${leadId}`)
}

export function createLead(payload) {
  return post(LEADS_BASE, payload)
}

export function updateLead(leadId, payload) {
  return patch(`${LEADS_BASE}/${leadId}`, payload)
}

export function deleteLead(leadId) {
  return del(`${LEADS_BASE}/${leadId}`)
}

export function convertLead(leadId, payload = {}) {
  return post(`${LEADS_BASE}/${leadId}/convert`, payload)
}

export function getLeadActivities(leadId, filters = {}) {
  return get(`${LEADS_BASE}/${leadId}/activities`, { query: filters })
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
