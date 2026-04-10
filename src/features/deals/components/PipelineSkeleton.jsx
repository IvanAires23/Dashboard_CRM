import Skeleton from '../../../components/ui/Skeleton.jsx'

function PipelineSkeleton({
  columns = 5,
  cardsPerColumn = 3,
}) {
  const columnCount = Math.max(1, columns)
  const dealCardsPerColumn = Math.max(1, cardsPerColumn)

  return (
    <div className="pipeline-board pipeline-board--skeleton" role="status" aria-label="Loading pipeline board">
      {Array.from({ length: columnCount }, (_, columnIndex) => (
        <section key={`pipeline-skeleton-column-${columnIndex}`} className="pipeline-column">
          <header className="pipeline-column__header">
            <div className="pipeline-column__title-row">
              <Skeleton className="pipeline-skeleton__title" />
              <Skeleton className="pipeline-skeleton__count" />
            </div>
            <Skeleton className="pipeline-skeleton__value" />
          </header>

          <div className="pipeline-column__cards">
            {Array.from({ length: dealCardsPerColumn }, (_, cardIndex) => (
              <article key={`pipeline-skeleton-card-${columnIndex}-${cardIndex}`} className="deal-card deal-card--skeleton">
                <div className="deal-card__top">
                  <Skeleton className="pipeline-skeleton__card-title" />
                  <Skeleton className="pipeline-skeleton__drag-handle" />
                </div>
                <Skeleton className="pipeline-skeleton__card-value" />
                <Skeleton className="pipeline-skeleton__card-meta" />
                <Skeleton className="pipeline-skeleton__card-meta" />
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default PipelineSkeleton
