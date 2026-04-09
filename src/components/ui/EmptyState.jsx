import clsx from 'clsx'
import Card from './Card.jsx'

function EmptyState({
  description,
  title,
  eyebrow = 'Empty',
  actionLabel,
  onAction,
  className,
  contained = true,
}) {
  const content = (
    <div className="empty-state__content">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
      {actionLabel && onAction ? (
        <button className="state-action" onClick={onAction} type="button">
          {actionLabel}
        </button>
      ) : null}
    </div>
  )

  if (!contained) {
    return <div className={clsx('empty-state empty-state--inline', className)}>{content}</div>
  }

  return <Card className={clsx('empty-state', className)}>{content}</Card>
}

export default EmptyState
