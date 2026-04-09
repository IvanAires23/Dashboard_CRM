import { z } from 'zod'

export function requiredString(label = 'This field') {
  return z.string().trim().min(1, `${label} is required.`)
}

export const emailSchema = requiredString('Email').email('Enter a valid email address.')
export const passwordSchema = requiredString('Password').min(
  6,
  'Password must be at least 6 characters.',
)

export default {
  requiredString,
  emailSchema,
  passwordSchema,
}
