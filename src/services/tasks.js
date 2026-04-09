import { del, get, patch, post } from './http.js'

const TASKS_BASE = '/tasks'

export function getTasks(filters = {}) {
  return get(TASKS_BASE, { query: filters })
}

export function getTaskById(taskId) {
  return get(`${TASKS_BASE}/${taskId}`)
}

export function createTask(payload) {
  return post(TASKS_BASE, payload)
}

export function updateTask(taskId, payload) {
  return patch(`${TASKS_BASE}/${taskId}`, payload)
}

export function deleteTask(taskId) {
  return del(`${TASKS_BASE}/${taskId}`)
}

export function completeTask(taskId, payload = {}) {
  return patch(`${TASKS_BASE}/${taskId}/complete`, payload)
}

export function reopenTask(taskId) {
  return patch(`${TASKS_BASE}/${taskId}/reopen`, {})
}

export function assignTask(taskId, ownerId) {
  return patch(`${TASKS_BASE}/${taskId}/assignee`, { ownerId })
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
