import { del, get, patch, post } from './http.js'
import { withCrmFallback } from './mockFallback.js'
import { mockCrmStore } from './mockCrmStore.js'

const TASKS_BASE = '/tasks'

export function getTasks(filters = {}) {
  return withCrmFallback(
    () => get(TASKS_BASE, { query: filters }),
    () => mockCrmStore.getTasks(filters),
  )
}

export function getTaskById(taskId) {
  return withCrmFallback(
    () => get(`${TASKS_BASE}/${taskId}`),
    () => mockCrmStore.getTaskById(taskId),
  )
}

export function createTask(payload) {
  return withCrmFallback(
    () => post(TASKS_BASE, payload),
    () => mockCrmStore.createTask(payload),
  )
}

export function updateTask(taskId, payload) {
  return withCrmFallback(
    () => patch(`${TASKS_BASE}/${taskId}`, payload),
    () => mockCrmStore.updateTask(taskId, payload),
  )
}

export function deleteTask(taskId) {
  return withCrmFallback(
    () => del(`${TASKS_BASE}/${taskId}`),
    () => mockCrmStore.deleteTask(taskId),
  )
}

export function completeTask(taskId, payload = {}) {
  return withCrmFallback(
    () => patch(`${TASKS_BASE}/${taskId}/complete`, payload),
    () => mockCrmStore.completeTask(taskId, payload),
  )
}

export function reopenTask(taskId) {
  return withCrmFallback(
    () => patch(`${TASKS_BASE}/${taskId}/reopen`, {}),
    () => mockCrmStore.reopenTask(taskId),
  )
}

export function assignTask(taskId, ownerId) {
  return withCrmFallback(
    () => patch(`${TASKS_BASE}/${taskId}/assignee`, { ownerId }),
    () => mockCrmStore.assignTask(taskId, ownerId),
  )
}

export default {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  reopenTask,
  assignTask,
}
