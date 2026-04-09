import { z } from 'zod'
import { requiredString } from '../../../lib/validation/common.js'

const accountSizeSchema = z.preprocess(
  (value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined
    }

    return Number(value)
  },
  z
    .number({
      error: 'Size is required.',
    })
    .int('Size must be a whole number.')
    .positive('Size must be greater than 0.'),
)

const websiteSchema = requiredString('Website').refine((value) => {
  const normalizedValue =
    value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`

  try {
    const parsedUrl = new URL(normalizedValue)
    return Boolean(parsedUrl.hostname)
  } catch {
    return false
  }
}, 'Enter a valid website URL.')

export const accountSchema = z.object({
  name: requiredString('Name').min(2, 'Name must be at least 2 characters.'),
  industry: requiredString('Industry'),
  size: accountSizeSchema,
  website: websiteSchema,
})

export const accountDefaultValues = Object.freeze({
  name: '',
  industry: '',
  size: '',
  website: '',
})

function asText(value) {
  return typeof value === 'string' ? value : ''
}

function normalizeWebsite(value) {
  const rawValue = asText(value).trim()

  if (!rawValue) {
    return ''
  }

  if (rawValue.startsWith('http://') || rawValue.startsWith('https://')) {
    return rawValue
  }

  return `https://${rawValue}`
}

export function getAccountFormValues(account) {
  const sourceAccount = account?.account ?? account?.data ?? account ?? {}

  return {
    name: asText(sourceAccount.name).trim(),
    industry: asText(sourceAccount.industry ?? sourceAccount.segment).trim(),
    size: sourceAccount.size ?? sourceAccount.employeeCount ?? sourceAccount.employees ?? '',
    website: normalizeWebsite(sourceAccount.website ?? sourceAccount.url ?? sourceAccount.siteUrl),
  }
}

export function buildAccountPayload(values) {
  const normalizedWebsite = normalizeWebsite(values.website)

  return {
    ...values,
    size: Number(values.size),
    employeeCount: Number(values.size),
    website: normalizedWebsite,
    url: normalizedWebsite,
  }
}

export default accountSchema
