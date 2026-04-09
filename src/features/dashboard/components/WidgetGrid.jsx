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
import {
  useSortable,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import clsx from 'clsx'
import { GripVertical } from 'lucide-react'
import Card from '../../../components/ui/Card.jsx'

function WidgetGridItem({ widget, disabled = false }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: widget.id,
    disabled,
  })

  return (
    <div
      ref={setNodeRef}
      className={clsx('dashboard-widget-shell', isDragging && 'dashboard-widget-shell--dragging')}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <button
        type="button"
        className="dashboard-widget-shell__handle"
        aria-label={`Reorder ${widget.label}`}
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </button>
      {widget.content}
    </div>
  )
}

function WidgetGridOverlay({ widget }) {
  if (!widget) {
    return null
  }

  return (
    <Card className="dashboard-widget-overlay">
      <p className="dashboard-widget-overlay__label">Widget</p>
      <strong>{widget.label}</strong>
    </Card>
  )
}

function WidgetGrid({
  widgets = [],
  onReorder = () => {},
  disabled = false,
}) {
  const [activeWidgetId, setActiveWidgetId] = useState('')
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

  const widgetIds = useMemo(() => widgets.map((widget) => widget.id), [widgets])
  const activeWidget = useMemo(
    () => widgets.find((widget) => widget.id === activeWidgetId) ?? null,
    [widgets, activeWidgetId],
  )

  const handleDragStart = (event) => {
    setActiveWidgetId(String(event.active?.id || ''))
  }

  const handleDragCancel = () => {
    setActiveWidgetId('')
  }

  const handleDragEnd = (event) => {
    const activeId = String(event.active?.id || '')
    const overId = String(event.over?.id || '')
    setActiveWidgetId('')

    if (!activeId || !overId || activeId === overId) {
      return
    }

    onReorder({
      activeId,
      overId,
    })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={widgetIds} strategy={rectSortingStrategy}>
        <section
          className={clsx('dashboard-widget-grid', disabled && 'dashboard-widget-grid--disabled')}
          aria-label="Dashboard widgets"
        >
          {widgets.map((widget) => (
            <WidgetGridItem key={widget.id} widget={widget} disabled={disabled} />
          ))}
        </section>
      </SortableContext>

      <DragOverlay>
        <WidgetGridOverlay widget={activeWidget} />
      </DragOverlay>
    </DndContext>
  )
}

export default WidgetGrid
