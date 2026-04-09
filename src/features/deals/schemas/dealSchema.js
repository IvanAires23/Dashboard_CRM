import { z } from 'zod'
import { requiredString } from '../../../lib/validation/common.js'

export const DEAL_PIPELINE_STAGES = Object.freeze([
  { id: 'new-lead', label: 'New Lead' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'closed-won', label: 'Closed Won' },
  { id: 'closed-lost', label: 'Closed Lost' },
])

const stageIds = DEAL_PIPELINE_STAGES.map((stage) => stage.id)

const dealValueSchema = z.preprocess(
  (value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined
    }

    return Number(value)
  },
  z
    .number({
      error: 'Deal value is required.',
    })
    .positive('Deal value must be greater than 0.'),
)

const expectedCloseDateSchema = requiredString('Expected close date').refine(
  (value) => !Number.isNaN(Date.parse(value)),
  { message: 'Enter a valid close date.' },
)

export const dealSchema = z.object({
  title: requiredString('Title').min(2, 'Title must be at least 2 characters.'),
  value: dealValueSchema,
  stage: requiredString('Stage').refine((value) => stageIds.includes(value), {
    message: 'Select a valid pipeline stage.',
  }),
  account: requiredString('Account'),
  contact: requiredString('Contact'),
  expectedCloseDate: expectedCloseDateSchema,
})

export const dealDefaultValues = Object.freeze({
  title: '',
  value: '',
  stage: DEAL_PIPELINE_STAGES[0].id,
  account: '',
  contact: '',
  expectedCloseDate: '',
})

function asText(value) {
  return typeof value === 'string' ? value : ''
}

function normalizeStage(value) {
  if (value && typeof value === 'object') {
    const objectStage = asText(value.id ?? value.name).trim().toLowerCase()
    return stageIds.includes(objectStage) ? objectStage : dealDefaultValues.stage
  }

  const normalizedValue = asText(value).trim().toLowerCase()
  return stageIds.includes(normalizedValue) ? normalizedValue : dealDefaultValues.stage
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

function extractEntityValue(entity) {
  if (!entity) {
    return ''
  }

  if (typeof entity === 'number' || typeof entity === 'bigint') {
    return String(entity)
  }

  if (typeof entity === 'string') {
    return entity
  }

  return (
    asText(entity.name).trim() ||
    asText(entity.fullName).trim() ||
    asText(entity.email).trim() ||
    asText(entity.id).trim()
  )
}

export function getDealFormValues(deal) {
  const sourceDeal = deal?.deal ?? deal?.data ?? deal ?? {}

  return {
    title: asText(sourceDeal.title ?? sourceDeal.name).trim(),
    value: sourceDeal.value ?? sourceDeal.amount ?? '',
    stage: normalizeStage(sourceDeal.stage ?? sourceDeal.stageId ?? sourceDeal.pipelineStage),
    account: extractEntityValue(sourceDeal.account ?? sourceDeal.accountId),
    contact: extractEntityValue(sourceDeal.contact ?? sourceDeal.contactId),
    expectedCloseDate: normalizeDate(
      sourceDeal.expectedCloseDate ?? sourceDeal.closeDate ?? sourceDeal.expected_close_date,
    ),
  }
}

export default dealSchema
