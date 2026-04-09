import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { deleteTask, getTaskById } from '../../../services/tasks.js'
import { extractEntity, getDisplayValue, resolveEntityId } from '../../../lib/crm/entityUtils.js'
import '../../../components/crud/crud.css'

function TaskDetailPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { taskId } = useParams()

  const taskQuery = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById(taskId),
    enabled: Boolean(taskId),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      navigate('/tasks', { replace: true })
    },
  })

  const task = extractEntity(taskQuery.data)
  const resolvedTaskId = resolveEntityId(task) || taskId

  const handleDelete = async () => {
    if (!resolvedTaskId || deleteMutation.isPending) {
      return
    }

    const shouldDelete = window.confirm('Delete this task? This action cannot be undone.')
    if (!shouldDelete) {
      return
    }

    await deleteMutation.mutateAsync(resolvedTaskId)
  }

  if (taskQuery.isPending) {
    return (
      <PageContainer>
        <LoadingState eyebrow="Tasks" title="Loading task" description="Fetching task details." />
      </PageContainer>
    )
  }

  if (taskQuery.isError || !task) {
    return (
      <PageContainer>
        <ErrorState
          eyebrow="Tasks"
          title="Unable to load task"
          description={taskQuery.error?.message || 'Task not found.'}
          onRetry={taskQuery.refetch}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <WidgetContainer
        eyebrow="Tasks"
        title={task?.title ?? task?.name ?? 'Task details'}
        meta={`Task ID: ${resolvedTaskId || '—'}`}
      >
        <div className="crud-detail">
          <dl className="crud-detail__grid">
            <div className="crud-detail__item">
              <dt>Title</dt>
              <dd>{getDisplayValue(task?.title ?? task?.name)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Description</dt>
              <dd>{getDisplayValue(task?.description ?? task?.details)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Status</dt>
              <dd>{getDisplayValue(task?.status)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Priority</dt>
              <dd>{getDisplayValue(task?.priority)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Due date</dt>
              <dd>{getDisplayValue(task?.dueDate ?? task?.due_at ?? task?.deadline)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Assigned user</dt>
              <dd>{getDisplayValue(task?.assignedUser?.name ?? task?.assignedUserId ?? task?.ownerId)}</dd>
            </div>
          </dl>

          <div className="crud-detail__actions">
            <Link to="/tasks">Back</Link>
            <Link className="primary" to={`/tasks/${resolvedTaskId}/edit`}>
              Edit
            </Link>
            <button type="button" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </WidgetContainer>
    </PageContainer>
  )
}

export default TaskDetailPage
