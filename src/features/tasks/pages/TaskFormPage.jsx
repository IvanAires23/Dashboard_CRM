import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { useAuth } from '../../auth/useAuth.js'
import { assignTask, createTask, getTaskById, updateTask } from '../../../services/tasks.js'
import TaskForm from '../components/TaskForm.jsx'
import { getTaskFormValues } from '../schemas/taskSchema.js'
import { getTaskAssigneeOptions } from '../taskUsers.js'
import './TaskFormPage.css'

function extractTaskId(payload) {
  return payload?.id ?? payload?.task?.id ?? payload?.data?.id ?? null
}

function TaskFormPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { taskId } = useParams()
  const isEditMode = Boolean(taskId)

  const taskQuery = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById(taskId),
    enabled: isEditMode,
  })

  const assigneesQuery = useQuery({
    queryKey: ['task-assignees', user?.id],
    queryFn: async () => getTaskAssigneeOptions(user),
  })

  const createMutation = useMutation({
    mutationFn: createTask,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateTask(id, payload),
  })

  const assignMutation = useMutation({
    mutationFn: ({ id, ownerId }) => assignTask(id, ownerId),
  })

  const initialValues = useMemo(() => getTaskFormValues(taskQuery.data), [taskQuery.data])

  const assigneeOptions = useMemo(() => {
    const options = Array.isArray(assigneesQuery.data) ? assigneesQuery.data : []
    const fallbackAssigneeId = initialValues.assignedUserId

    if (!fallbackAssigneeId) {
      return options
    }

    if (options.some((option) => option.value === fallbackAssigneeId)) {
      return options
    }

    return [{ value: fallbackAssigneeId, label: `User ${fallbackAssigneeId}` }, ...options]
  }, [assigneesQuery.data, initialValues.assignedUserId])

  const handleSubmit = async (values) => {
    if (isEditMode) {
      await updateMutation.mutateAsync({
        id: taskId,
        payload: values,
      })

      if (initialValues.assignedUserId !== values.assignedUserId) {
        await assignMutation.mutateAsync({
          id: taskId,
          ownerId: values.assignedUserId,
        })
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['tasks'] }),
        queryClient.invalidateQueries({ queryKey: ['task', taskId] }),
      ])
      return
    }

    const createdTask = await createMutation.mutateAsync(values)
    const nextTaskId = extractTaskId(createdTask)

    if (nextTaskId && values.assignedUserId) {
      await assignMutation.mutateAsync({
        id: nextTaskId,
        ownerId: values.assignedUserId,
      })
    }

    await queryClient.invalidateQueries({ queryKey: ['tasks'] })
    if (nextTaskId) {
      await queryClient.invalidateQueries({ queryKey: ['task', nextTaskId] })
    }

    if (nextTaskId) {
      navigate(`/tasks/${nextTaskId}/edit`, { replace: true })
    }
  }

  const isSaving =
    createMutation.isPending || updateMutation.isPending || assignMutation.isPending
  const isLoadingData = assigneesQuery.isPending || (isEditMode && taskQuery.isPending)
  const hasLoadError = assigneesQuery.isError || (isEditMode && taskQuery.isError)

  if (isLoadingData) {
    return (
      <PageContainer className="task-form-page">
        <LoadingState
          title={isEditMode ? 'Loading task' : 'Loading assignees'}
          description={
            isEditMode
              ? 'Fetching task details and users so you can edit this work item.'
              : 'Fetching users so this task can be assigned.'
          }
          eyebrow="Tasks"
        />
      </PageContainer>
    )
  }

  if (hasLoadError) {
    return (
      <PageContainer className="task-form-page">
        <ErrorState
          eyebrow="Tasks"
          title="Unable to load form data"
          description={
            taskQuery.error?.message ??
            assigneesQuery.error?.message ??
            'Please try again in a few seconds.'
          }
          onRetry={() => {
            if (isEditMode) {
              taskQuery.refetch()
            }
            assigneesQuery.refetch()
          }}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer className="task-form-page">
      <WidgetContainer
        className="task-form-panel"
        eyebrow="Tasks"
        title={isEditMode ? 'Edit task' : 'Create task'}
        meta={isEditMode ? `Task ID: ${taskId}` : 'Capture work details and assign ownership'}
      >
        <p className="task-form-page__description">
          {isEditMode
            ? 'Update task details, status and ownership.'
            : 'Create a task and assign it to a CRM user.'}
        </p>

        <TaskForm
          key={isEditMode ? `task-edit-${taskId}` : 'task-create'}
          mode={isEditMode ? 'edit' : 'create'}
          initialValues={initialValues}
          assigneeOptions={assigneeOptions}
          isSaving={isSaving}
          onSubmit={handleSubmit}
        />
      </WidgetContainer>
    </PageContainer>
  )
}

export default TaskFormPage
