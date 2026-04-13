const USE_CRM_MOCK = import.meta.env?.VITE_CRM_MOCK !== 'false'

const FALLBACK_ERROR_CODES = new Set(['NETWORK_ERROR', 'PARSE_ERROR', 'TIMEOUT_ERROR'])

function canFallbackToMock(error) {
  if (!error) {
    return false
  }

  if (FALLBACK_ERROR_CODES.has(error.code)) {
    return true
  }

  if (Number.isFinite(error.status) && error.status >= 500) {
    return true
  }

  return false
}

export function shouldUseCrmMock() {
  return USE_CRM_MOCK
}

export async function withCrmFallback(apiRequest, mockRequest) {
  if (USE_CRM_MOCK) {
    return mockRequest()
  }

  try {
    return await apiRequest()
  } catch (error) {
    if (canFallbackToMock(error)) {
      return mockRequest()
    }

    throw error
  }
}

