import clsx from 'clsx'
import { GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Link } from 'react-router-dom'

function DealCardContent({
  deal,
  className,
  style,
  dragHandleProps,
  overlay = false,
  disabled = false,
}) {
  return (
    <article className={clsx('deal-card', className)} data-deal-id={deal.id} style={style}>
      <header className="deal-card__top">
        <h4 className="deal-card__title">
          {overlay ? deal.title : <Link to={`/deals/${deal.id}`}>{deal.title}</Link>}
        </h4>
        {dragHandleProps ? (
          <button
            type="button"
            className="deal-card__drag-handle"
            aria-label={`Move ${deal.title}`}
            disabled={disabled}
            {...dragHandleProps}
          >
            <GripVertical size={14} />
          </button>
        ) : null}
      </header>

      <p className="deal-card__value">{deal.valueLabel}</p>

      <dl className="deal-card__meta">
        <div>
          <dt>Account</dt>
          <dd>{deal.account}</dd>
        </div>
        <div>
          <dt>Contact</dt>
          <dd>{deal.contact}</dd>
        </div>
        <div>
          <dt>Owner</dt>
          <dd>{deal.owner}</dd>
        </div>
        <div>
          <dt>Close</dt>
          <dd>{deal.expectedCloseDateLabel}</dd>
        </div>
      </dl>

      {!overlay ? (
        <div className="deal-card__actions">
          <Link to={`/deals/${deal.id}`}>View</Link>
          <Link to={`/deals/${deal.id}/edit`}>Edit</Link>
        </div>
      ) : null}
    </article>
  )
}

function SortableDealCard({ deal, disabled = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: deal.id,
    data: {
      type: 'deal',
      dealId: deal.id,
      stageId: deal.stageId,
    },
    disabled,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <DealCardContent
        deal={deal}
        className={clsx(isDragging && 'deal-card--dragging', disabled && 'deal-card--disabled')}
        dragHandleProps={{
          ...attributes,
          ...listeners,
        }}
        disabled={disabled}
      />
    </div>
  )
}

function DealCard({ deal, sortable = true, disabled = false, overlay = false }) {
  if (!sortable) {
    return (
      <DealCardContent
        deal={deal}
        overlay={overlay}
        className={clsx(overlay && 'deal-card--overlay')}
      />
    )
  }

  return <SortableDealCard deal={deal} disabled={disabled} />
}

export default DealCard
