import { z } from 'zod'
import { requiredString } from '../../../lib/validation/common.js'

export const TASK_PRIORITY_OPTIONS = Object.freeze([
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
  { id: 'urgent', label: 'Urgent' },
])

export const TASK_STATUS_OPTIONS = Object.freeze([
  { id: 'todo', label: 'To do' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'done', label: 'Done' },
])

const priorityIds = TASK_PRIORITY_OPTIONS.map((option) => option.id)
const statusIds = TASK_STATUS_OPTIONS.map((option) => option.id)

export function createTaskSchema(validAssigneeIds = []) {
  const hasAssigneeScope = Array.isArray(validAssigneeIds) && validAssigneeIds.length > 0

  const dueDateSchema = requiredString('Due date').refine(
    (value) => !Number.isNaN(Date.parse(value)),
    { message: 'Enter a valid due date.' },
  )

  const assignedUserSchema = requiredString('Assigned user')

  return z.object({
    title: requiredString('Title').min(2, 'Title must be at least 2 characters.'),
    description: requiredString('Description').min(4, 'Description must be at least 4 characters.'),
    dueDate: dueDateSchema,
    priority: requiredString('Priority').refine((value) => priorityIds.includes(value), {
      message: 'Select a valid priority.',
    }),
    status: requiredString('Status').refine((value) => statusIds.includes(value), {
      message: 'Select a valid status.',
    }),
    assignedUserId: hasAssigneeScope
      ? assignedUserSchema.refine((value) => validAssigneeIds.includes(value), {
          message: 'Select a valid assigned user.',
        })
      : assignedUserSchema,
  })
}

export const taskSchema = createTaskSchema()

export const taskDefaultValues = Object.freeze({
  title: '',
  description: '',
  dueDate: '',
  priority: TASK_PRIORITY_OPTIONS[1].id,
  status: TASK_STATUS_OPTIONS[0].id,
  assignedUserId: '',
})

function asText(value) {
  return typeof value === 'string' ? value : ''
}

function normalizeOption(value, validValues, fallback) {
  const normalizedValue = asText(value).trim().toLowerCase()
  return validValues.includes(normalizedValue) ? normalizedValue : fallback
}

function normalizeDate(value) {
  const rawValue = asText(value).trim()
  if (!rawValue) {
    return ''
  }

  const parsedDate = new Date(rawValue)
  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const day = String(parsedDate.getDate()).padStart(2, '0')
  return `${parsedDate.getFullYear()}-${month}-${day}`
}

function normalizeEntityId(value) {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'bigint') {
    return String(value)
  }

  return (
    asText(value.id).trim() ||
    asText(value.userId).trim() ||
    asText(value.ownerId).trim() ||
    asText(value.assigneeId).trim()
  )
}

export function getTaskFormValues(task) {
  const sourceTask = task?.task ?? task?.data ?? task ?? {}

  return {
    title: asText(sourceTask.title ?? sourceTask.name).trim(),
    description: asText(sourceTask.description ?? sourceTask.details).trim(),
    dueDate: normalizeDate(sourceTask.dueDate ?? sourceTask.deadline ?? sourceTask.due_at),
    priority: normalizeOption(sourceTask.priority, priorityIds, taskDefaultValues.priority),
    status: normalizeOption(sourceTask.status, statusIds, taskDefaultValues.status),
    assignedUserId: normalizeEntityId(
      sourceTask.assignedUserId ?? sourceTask.assigneeId ?? sourceTask.ownerId ?? sourceTask.assignee,
    ),
  }
}

export function buildTaskPayload(values) {
  return {
    ...values,
    dueDate: values.dueDate,
    due_at: values.dueDate,
    assignedUserId: values.assignedUserId,
    assigneeId: values.assignedUserId,
    ownerId: values.assignedUserId,
  }
}

export default taskSchema
