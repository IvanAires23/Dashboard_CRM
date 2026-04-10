import { describe, expect, it } from 'vitest'
import { createAppError, getErrorMessage, normalizeError } from './normalizeError.js'

describe('normalizeError', () => {
  it('normalizes service errors with user-facing message', () => {
    const error = createAppError({
      message: 'Request failed with status 404.',
      code: 'HTTP_ERROR',
      status: 404,
      method: 'GET',
      url: '/leads/1',
    })

    const normalized = normalizeError(error)

    expect(normalized.code).toBe('HTTP_ERROR')
    expect(normalized.status).toBe(404)
    expect(normalized.userMessage).toBe('The requested record was not found.')
  })

  it('falls back to provided default message when needed', () => {
    expect(getErrorMessage(null, 'Fallback message')).toBe('Fallback message')
  })
})

