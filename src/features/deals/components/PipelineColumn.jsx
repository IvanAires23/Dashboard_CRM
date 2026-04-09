import clsx from 'clsx'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import DealCard from './DealCard.jsx'

function PipelineColumn({
  stageId,
  label,
  deals = [],
  totalValueLabel,
  isDragDisabled = false,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: stageId,
    data: {
      type: 'stage',
      stageId,
    },
  })

  const itemIds = deals.map((deal) => deal.id)

  return (
    <section
      ref={setNodeRef}
      className={clsx('pipeline-column', isOver && 'pipeline-column--over')}
      data-stage-id={stageId}
    >
      <header className="pipeline-column__header">
        <div className="pipeline-column__title-row">
          <h3 className="pipeline-column__title">{label}</h3>
          <span className="pipeline-column__count">{deals.length} deals</span>
        </div>
        <p className="pipeline-column__value">{totalValueLabel}</p>
      </header>

      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <div className="pipeline-column__cards">
          {deals.length ? (
            deals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                sortable={!isDragDisabled}
                disabled={isDragDisabled}
              />
            ))
          ) : (
            <p className="pipeline-column__empty">
              {isDragDisabled ? 'No deals in this stage.' : 'Drop a deal here.'}
            </p>
          )}
        </div>
      </SortableContext>
    </section>
  )
}

export default PipelineColumn
