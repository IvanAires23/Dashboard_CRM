import { arrayMove } from '@dnd-kit/sortable'

function toId(value) {
  if (value === null || value === undefined) {
    return ''
  }

  return String(value)
}

export function normalizeWidgetOrder(order = [], availableIds = []) {
  const normalizedAvailableIds = availableIds.map((id) => toId(id)).filter(Boolean)
  const availableSet = new Set(normalizedAvailableIds)
  const normalizedOrder = (Array.isArray(order) ? order : [])
    .map((id) => toId(id))
    .filter((id) => availableSet.has(id))

  const missingIds = normalizedAvailableIds.filter((id) => !normalizedOrder.includes(id))
  return [...normalizedOrder, ...missingIds]
}

export function reorderWidgetOrder(order = [], activeId, overId) {
  const normalizedOrder = order.map((id) => toId(id))
  const activeIndex = normalizedOrder.indexOf(toId(activeId))
  const overIndex = normalizedOrder.indexOf(toId(overId))

  if (activeIndex < 0 || overIndex < 0 || activeIndex === overIndex) {
    return normalizedOrder
  }

  return arrayMove(normalizedOrder, activeIndex, overIndex)
}

export function readWidgetOrder(storageKey) {
  if (typeof window === 'undefined' || !storageKey) {
    return []
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey)
    if (!rawValue) {
      return []
    }

    const parsed = JSON.parse(rawValue)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function writeWidgetOrder(storageKey, order) {
  if (typeof window === 'undefined' || !storageKey) {
    return
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(order))
  } catch {
    // no-op: persistence failure should not block interaction
  }
}

export default {
  normalizeWidgetOrder,
  readWidgetOrder,
  reorderWidgetOrder,
  writeWidgetOrder,
}
