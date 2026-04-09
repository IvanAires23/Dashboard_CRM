import { z } from 'zod'
import { emailSchema, requiredString } from '../../../lib/validation/common.js'

const phonePattern = /^\+?[0-9\s().-]{7,20}$/

export const leadStatusOptions = Object.freeze([
  'new',
  'qualified',
  'contacted',
  'proposal',
  'lost',
])

export const leadSourceOptions = Object.freeze([
  'website',
  'referral',
  'outbound',
  'ads',
  'event',
  'other',
])

const statusSchema = requiredString('Status').refine(
  (value) => leadStatusOptions.includes(value),
  { message: 'Select a valid status.' },
)

const sourceSchema = requiredString('Source').refine(
  (value) => leadSourceOptions.includes(value),
  { message: 'Select a valid source.' },
)

export const leadSchema = z.object({
  name: requiredString('Name').min(2, 'Name must be at least 2 characters.'),
  email: emailSchema,
  phone: requiredString('Phone').regex(phonePattern, 'Enter a valid phone number.'),
  company: requiredString('Company'),
  status: statusSchema,
  source: sourceSchema,
})

export const leadDefaultValues = Object.freeze({
  name: '',
  email: '',
  phone: '',
  company: '',
  status: leadStatusOptions[0],
  source: leadSourceOptions[0],
})

function asText(value) {
  return typeof value === 'string' ? value : ''
}

function normalizeOption(value, options, fallback) {
  const normalizedValue = asText(value).trim().toLowerCase()
  return options.includes(normalizedValue) ? normalizedValue : fallback
}

export function getLeadFormValues(lead) {
  const sourceLead = lead?.lead ?? lead?.data ?? lead ?? {}

  return {
    name: asText(sourceLead.name).trim(),
    email: asText(sourceLead.email).trim().toLowerCase(),
    phone: asText(sourceLead.phone).trim(),
    company: asText(sourceLead.company ?? sourceLead.companyName).trim(),
    status: normalizeOption(sourceLead.status, leadStatusOptions, leadDefaultValues.status),
    source: normalizeOption(sourceLead.source, leadSourceOptions, leadDefaultValues.source),
  }
}

export default leadSchema
