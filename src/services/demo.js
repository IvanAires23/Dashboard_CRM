import { createAppError } from '../lib/errors/normalizeError.js'
import { shouldUseCrmMock } from './mockFallback.js'
import { mockCrmStore } from './mockCrmStore.js'

export function isDemoModeEnabled() {
  return shouldUseCrmMock()
}

export async function resetCrmDemoData() {
  if (!shouldUseCrmMock()) {
    throw createAppError({
      code: 'HTTP_ERROR',
      status: 400,
      message: 'Demo mode is disabled. Enable VITE_CRM_MOCK=true to reset demo data.',
    })
  }

  return mockCrmStore.reset()
}

export default {
  isDemoModeEnabled,
  resetCrmDemoData,
}

