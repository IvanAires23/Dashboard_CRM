import { z } from 'zod'
import { emailSchema, passwordSchema } from '../../../lib/validation/common.js'

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const loginDefaultValues = {
  email: '',
  password: '',
}

export default loginSchema
