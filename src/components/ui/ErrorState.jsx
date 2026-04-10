import clsx from 'clsx'
import Card from './Card.jsx'
import { getErrorDiagnosticSummary, normalizeError } from '../../lib/errors/normalizeError.js'

function ErrorState({
  title = 'Unable to load data',
  description = '',
  error = null,
  eyebrow = 'Error',
  onRetry,
  retryLabel = 'Try again',
  showDiagnostics = import.meta.env.DEV,
  className,
  contained = true,
}) {
  const normalizedError = normalizeError(error, {
    fallbackMessage: description || 'Please try again in a few seconds.',
  })
  const resolvedDescription = description || normalizedError.userMessage

  const content = (
    <div className="error-state__content">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{resolvedDescription}</p>
      {onRetry ? (
        <button className="state-action" onClick={onRetry} type="button">
          {retryLabel}
        </button>
      ) : null}
      {showDiagnostics && error ? (
        <pre className="error-state__diagnostic" aria-label="error diagnostics">
          {getErrorDiagnosticSummary(normalizedError)}
        </pre>
      ) : null}
    </div>
  )

  if (!contained) {
    return <div className={clsx('error-state error-state--inline', className)}>{content}</div>
  }

  return <Card className={clsx('error-state', className)}>{content}</Card>
}

export default ErrorState
