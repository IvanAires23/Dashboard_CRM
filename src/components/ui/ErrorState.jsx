import clsx from 'clsx'
import Card from './Card.jsx'

function ErrorState({
  title = 'Unable to load data',
  description = 'Please try again in a few seconds.',
  eyebrow = 'Error',
  onRetry,
  retryLabel = 'Try again',
  className,
  contained = true,
}) {
  const content = (
    <div className="error-state__content">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
      {onRetry ? (
        <button className="state-action" onClick={onRetry} type="button">
          {retryLabel}
        </button>
      ) : null}
    </div>
  )

  if (!contained) {
    return <div className={clsx('error-state error-state--inline', className)}>{content}</div>
  }

  return <Card className={clsx('error-state', className)}>{content}</Card>
}

export default ErrorState
