import { DEFAULT_USER_ERROR_MESSAGE, resolveUserErrorMessage } from './errorMessages.js'

function asText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function asFiniteNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function getRawMessage(error) {
  if (!error) {
    return ''
  }

  if (typeof error?.debugMessage === 'string' && error.debugMessage.trim()) {
    return error.debugMessage.trim()
  }

  if (typeof error === 'string') {
    return asText(error)
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message.trim()
  }

  if (typeof error?.details === 'string' && error.details.trim()) {
    return error.details.trim()
  }

  if (typeof error?.details?.message === 'string' && error.details.message.trim()) {
    return error.details.message.trim()
  }

  if (typeof error?.details?.error === 'string' && error.details.error.trim()) {
    return error.details.error.trim()
  }

  return ''
}

function getErrorCode(error) {
  if (typeof error?.code === 'string' && error.code.trim()) {
    return error.code.trim().toUpperCase()
  }

  if (error?.name === 'AbortError') {
    return 'ABORT_ERROR'
  }

  return 'UNKNOWN_ERROR'
}

export function createAppError({
  message,
  userMessage,
  code = 'APP_ERROR',
  status = null,
  method = null,
  url = null,
  details = null,
  cause = null,
  name = 'AppError',
} = {}) {
  const rawMessage = asText(message)
  const resolvedCode = asText(code).toUpperCase() || 'APP_ERROR'
  const resolvedStatus = asFiniteNumber(status)
  const resolvedUserMessage =
    asText(userMessage) ||
    resolveUserErrorMessage({
      code: resolvedCode,
      status: resolvedStatus,
      rawMessage,
    })

  const error = new Error(resolvedUserMessage, { cause })
  error.name = name
  error.code = resolvedCode
  error.status = resolvedStatus
  error.method = asText(method) || null
  error.url = asText(url) || null
  error.details = details ?? null
  error.userMessage = resolvedUserMessage
  error.debugMessage = rawMessage || resolvedUserMessage
  error.isAppError = true
  error.isHttpError = resolvedCode === 'HTTP_ERROR' || Boolean(error.isHttpError)
  return error
}

export function normalizeError(error, options = {}) {
  const fallbackMessage = asText(options.fallbackMessage) || DEFAULT_USER_ERROR_MESSAGE
  const rawMessage = getRawMessage(error)
  const code = getErrorCode(error)
  const status = asFiniteNumber(error?.status)
  const userMessage =
    asText(error?.userMessage) ||
    resolveUserErrorMessage({
      code,
      status,
      rawMessage,
      defaultMessage: fallbackMessage,
    })

  return {
    name: asText(error?.name) || 'Error',
    code,
    status,
    message: rawMessage || fallbackMessage,
    userMessage,
    details: error?.details ?? null,
    method: asText(error?.method) || null,
    url: asText(error?.url) || null,
    isHttpError: Boolean(error?.isHttpError),
    isNetworkError: code === 'NETWORK_ERROR',
    isAbortError: code === 'ABORT_ERROR',
    originalError: error ?? null,
  }
}

export function getErrorMessage(error, fallbackMessage = DEFAULT_USER_ERROR_MESSAGE) {
  return normalizeError(error, { fallbackMessage }).userMessage
}

export function getErrorDiagnosticSummary(error) {
  const normalized = normalizeError(error)
  const statusToken = normalized.status ? ` status=${normalized.status}` : ''
  const methodToken = normalized.method ? ` method=${normalized.method}` : ''
  const urlToken = normalized.url ? ` url=${normalized.url}` : ''
  return `[${normalized.code}]${statusToken}${methodToken}${urlToken} ${normalized.message}`
}
