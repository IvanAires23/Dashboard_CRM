import { del, get, patch, post } from './http.js'
import { withCrmFallback } from './mockFallback.js'
import { mockCrmStore } from './mockCrmStore.js'

const DEALS_BASE = '/deals'

export function getDeals(filters = {}) {
  return withCrmFallback(
    () => get(DEALS_BASE, { query: filters }),
    () => mockCrmStore.getDeals(filters),
  )
}

export function getDealById(dealId) {
  return withCrmFallback(
    () => get(`${DEALS_BASE}/${dealId}`),
    () => mockCrmStore.getDealById(dealId),
  )
}

export function createDeal(payload) {
  return withCrmFallback(
    () => post(DEALS_BASE, payload),
    () => mockCrmStore.createDeal(payload),
  )
}

export function updateDeal(dealId, payload) {
  return withCrmFallback(
    () => patch(`${DEALS_BASE}/${dealId}`, payload),
    () => mockCrmStore.updateDeal(dealId, payload),
  )
}

export function deleteDeal(dealId) {
  return withCrmFallback(
    () => del(`${DEALS_BASE}/${dealId}`),
    () => mockCrmStore.deleteDeal(dealId),
  )
}

export function moveDealStage(dealId, stageId) {
  return withCrmFallback(
    () => patch(`${DEALS_BASE}/${dealId}/stage`, { stageId }),
    () => mockCrmStore.moveDealStage(dealId, stageId),
  )
}

export function getDealTimeline(dealId, filters = {}) {
  return withCrmFallback(
    () => get(`${DEALS_BASE}/${dealId}/timeline`, { query: filters }),
    () => mockCrmStore.getDealTimeline(dealId, filters),
  )
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
