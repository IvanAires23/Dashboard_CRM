import { getErrorDiagnosticSummary, normalizeError } from './normalizeError.js'

export function reportError(error, context = 'app', extra = null) {
  const normalized = normalizeError(error)

  if (import.meta.env.DEV) {
    const contextLabel = `[${context}]`
    console.groupCollapsed(`${contextLabel} ${getErrorDiagnosticSummary(error)}`)
    console.error(error)
    if (extra) {
      console.info('context', extra)
    }
    console.groupEnd()
  }

  return normalized
}

export default reportError

