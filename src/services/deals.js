import { del, get, patch, post } from './http.js'

const DEALS_BASE = '/deals'

export function getDeals(filters = {}) {
  return get(DEALS_BASE, { query: filters })
}

export function getDealById(dealId) {
  return get(`${DEALS_BASE}/${dealId}`)
}

export function createDeal(payload) {
  return post(DEALS_BASE, payload)
}

export function updateDeal(dealId, payload) {
  return patch(`${DEALS_BASE}/${dealId}`, payload)
}

export function deleteDeal(dealId) {
  return del(`${DEALS_BASE}/${dealId}`)
}

export function moveDealStage(dealId, stageId) {
  return patch(`${DEALS_BASE}/${dealId}/stage`, { stageId })
}

export function getDealTimeline(dealId, filters = {}) {
  return get(`${DEALS_BASE}/${dealId}/timeline`, { query: filters })
}

export default {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
  moveDealStage,
  getDealTimeline,
}
