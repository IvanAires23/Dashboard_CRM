import clsx from 'clsx'
import Card from './Card.jsx'

function LoadingState({
  title = 'Loading data',
  description = 'Please wait while we fetch the latest information.',
  eyebrow = 'Loading',
  className,
  contained = true,
}) {
  const content = (
    <div className="loading-state__content">
      <p className="eyebrow">{eyebrow}</p>
      <div className="loading-state__row">
        <span className="loading-state__spinner" aria-hidden="true" />
        <h2>{title}</h2>
      </div>
      <p>{description}</p>
    </div>
  )

  if (!contained) {
    return <div className={clsx('loading-state loading-state--inline', className)}>{content}</div>
  }

  return <Card className={clsx('loading-state', className)}>{content}</Card>
}

export default LoadingState
