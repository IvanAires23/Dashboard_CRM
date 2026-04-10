export const DEFAULT_USER_ERROR_MESSAGE =
  'Unable to complete this request right now. Please try again.'

const STATUS_MESSAGES = Object.freeze({
  400: 'The request is invalid. Please review the provided data.',
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested record was not found.',
  409: 'This record was changed elsewhere. Refresh and try again.',
  422: 'Some fields are invalid. Please review and try again.',
  429: 'Too many requests. Wait a moment and try again.',
  500: 'Server error. Please try again in a few moments.',
  502: 'Service temporarily unavailable. Please try again soon.',
  503: 'Service temporarily unavailable. Please try again soon.',
  504: 'Request timed out. Please try again.',
})

const CODE_MESSAGES = Object.freeze({
  NETWORK_ERROR: 'Unable to reach the server. Check your connection and try again.',
  PARSE_ERROR: 'Unexpected server response. Please try again.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  ABORT_ERROR: 'Request was cancelled.',
})

function asTrimmedText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export function getStatusErrorMessage(status) {
  if (!Number.isFinite(status)) {
    return ''
  }

  if (STATUS_MESSAGES[status]) {
    return STATUS_MESSAGES[status]
  }

  if (status >= 500) {
    return STATUS_MESSAGES[500]
  }

  return ''
}

export function getCodeErrorMessage(code) {
  const normalizedCode = asTrimmedText(code).toUpperCase()
  return CODE_MESSAGES[normalizedCode] || ''
}

export function resolveUserErrorMessage({
  code,
  status,
  rawMessage,
  defaultMessage = DEFAULT_USER_ERROR_MESSAGE,
} = {}) {
  const codeMessage = getCodeErrorMessage(code)
  if (codeMessage) {
    return codeMessage
  }

  const statusMessage = getStatusErrorMessage(status)
  if (statusMessage) {
    return statusMessage
  }

  const normalizedRawMessage = asTrimmedText(rawMessage)
  if (normalizedRawMessage) {
    return normalizedRawMessage
  }

  return asTrimmedText(defaultMessage) || DEFAULT_USER_ERROR_MESSAGE
}
