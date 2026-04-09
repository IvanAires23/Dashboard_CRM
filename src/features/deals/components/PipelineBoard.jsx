import { useMemo, useState } from 'react'
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import clsx from 'clsx'
import DealCard from './DealCard.jsx'
import PipelineColumn from './PipelineColumn.jsx'
import { applyPipelineDrag, findDealById } from '../lib/pipelineDnd.js'
import './PipelineBoard.css'

function PipelineBoard({
  columns = [],
  onDealStageChange = async () => {},
  isStageUpdating = false,
}) {
  const [transientColumns, setTransientColumns] = useState(null)
  const [activeDealId, setActiveDealId] = useState('')
  const boardColumns = transientColumns ?? columns

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const activeDeal = useMemo(
    () => findDealById(boardColumns, activeDealId),
    [boardColumns, activeDealId],
  )

  const handleDragStart = (event) => {
    setActiveDealId(String(event.active.id))
  }

  const handleDragCancel = () => {
    setActiveDealId('')
  }

  const handleDragEnd = async (event) => {
    const activeId = String(event.active?.id || '')
    const overId = String(event.over?.id || '')
    setActiveDealId('')

    if (!activeId || !overId || activeId === overId) {
      return
    }

    const dragResult = applyPipelineDrag(boardColumns, {
      activeDealId: activeId,
      overId,
    })

    if (!dragResult) {
      return
    }

    setTransientColumns(dragResult.columns)

    if (dragResult.movement?.fromStageId === dragResult.movement?.toStageId) {
      setTransientColumns(null)
      return
    }

    try {
      await onDealStageChange(dragResult.movement)
      setTransientColumns(null)
    } catch {
      setTransientColumns(null)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <div
        className={clsx('pipeline-board', isStageUpdating && 'pipeline-board--disabled')}
        role="list"
        aria-label="Sales pipeline board"
      >
        {boardColumns.map((column) => (
          <div key={column.stageId} role="listitem">
            <PipelineColumn {...column} isDragDisabled={isStageUpdating} />
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeDeal ? <DealCard deal={activeDeal} sortable={false} overlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}

export default PipelineBoard
