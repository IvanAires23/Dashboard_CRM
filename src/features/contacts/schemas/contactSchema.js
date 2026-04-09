import { z } from 'zod'
import { emailSchema, requiredString } from '../../../lib/validation/common.js'

const phonePattern = /^\+?[0-9\s().-]{7,20}$/

export function createContactSchema(validAccountIds = []) {
  const hasAccountScope = Array.isArray(validAccountIds) && validAccountIds.length > 0

  const accountRelationSchema = requiredString('Account relation')

  return z.object({
    name: requiredString('Name').min(2, 'Name must be at least 2 characters.'),
    email: emailSchema,
    phone: requiredString('Phone').regex(phonePattern, 'Enter a valid phone number.'),
    accountId: hasAccountScope
      ? accountRelationSchema.refine((value) => validAccountIds.includes(value), {
          message: 'Select a valid account relation.',
        })
      : accountRelationSchema,
  })
}

export const contactSchema = createContactSchema()

export const contactDefaultValues = Object.freeze({
  name: '',
  email: '',
  phone: '',
  accountId: '',
})

function asText(value) {
  return typeof value === 'string' ? value : ''
}

function normalizeEntityId(entity) {
  if (!entity) {
    return ''
  }

  if (typeof entity === 'number' || typeof entity === 'bigint') {
    return String(entity)
  }

  if (typeof entity === 'string') {
    return entity
  }

  return asText(entity.id).trim()
}

export function getContactFormValues(contact) {
  const sourceContact = contact?.contact ?? contact?.data ?? contact ?? {}

  return {
    name: asText(sourceContact.name ?? sourceContact.fullName).trim(),
    email: asText(sourceContact.email).trim().toLowerCase(),
    phone: asText(sourceContact.phone ?? sourceContact.mobile).trim(),
    accountId: normalizeEntityId(sourceContact.accountId ?? sourceContact.account ?? sourceContact.company),
  }
}

export function buildContactPayload(values) {
  return {
    ...values,
    accountId: values.accountId,
    accountRelation: values.accountId,
  }
}

export default contactSchema
