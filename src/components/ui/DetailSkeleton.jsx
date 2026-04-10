import Skeleton from './Skeleton.jsx'

function DetailSkeleton({
  fields = 6,
  actions = 3,
}) {
  const fieldCount = Math.max(1, fields)
  const actionCount = Math.max(1, actions)

  return (
    <div className="crud-detail detail-skeleton" role="status" aria-label="Loading details">
      <dl className="crud-detail__grid">
        {Array.from({ length: fieldCount }, (_, index) => (
          <div key={`detail-skeleton-field-${index}`} className="crud-detail__item">
            <dt>
              <Skeleton className="detail-skeleton__label" />
            </dt>
            <dd>
              <Skeleton className="detail-skeleton__value" />
            </dd>
          </div>
        ))}
      </dl>

      <div className="crud-detail__actions">
        {Array.from({ length: actionCount }, (_, index) => (
          <Skeleton key={`detail-skeleton-action-${index}`} className="detail-skeleton__action" />
        ))}
      </div>
    </div>
  )
}

export default DetailSkeleton
