import { useEffect, useMemo } from 'react'
import { DateInput, SelectInput, TextArea, TextInput } from '../../../components/form/index.js'
import FormFeedback from '../../../lib/forms/FormFeedback.jsx'
import { useAsyncFormSubmission } from '../../../lib/forms/submission.js'
import { useToast } from '../../../lib/toast/useToast.js'
import { useZodForm } from '../../../lib/forms/useZodForm.js'
import {
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
  buildTaskPayload,
  createTaskSchema,
  getTaskFormValues,
  taskDefaultValues,
} from '../schemas/taskSchema.js'
import './TaskForm.css'

function TaskForm({
  mode = 'create',
  initialValues,
  assigneeOptions = [],
  isSaving = false,
  onSubmit = async () => {},
}) {
  const resolvedInitialValues = useMemo(
    () => getTaskFormValues(initialValues ?? taskDefaultValues),
    [initialValues],
  )

  const validationSchema = useMemo(
    () => createTaskSchema(assigneeOptions.map((option) => option.value)),
    [assigneeOptions],
  )

  const {
    register,
    handleSubmit,
    reset,
    getFieldError,
    formState: { isSubmitting },
  } = useZodForm({
    schema: validationSchema,
    defaultValues: resolvedInitialValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  useEffect(() => {
    reset(resolvedInitialValues)
  }, [reset, resolvedInitialValues])

  const isEditMode = mode === 'edit'
  const hasAssignees = assigneeOptions.length > 0
  const toast = useToast()
  const {
    isSubmittingAsync,
    successMessage,
    errorMessage,
    executeSubmission,
    setErrorMessage,
  } = useAsyncFormSubmission({
    successMessage: isEditMode ? 'Task updated successfully.' : 'Task created successfully.',
    defaultErrorMessage: 'Unable to save task right now. Please try again.',
    onSuccess: ({ message }) => {
      toast.success(message || 'Task saved successfully.')
    },
    onError: ({ message }) => {
      toast.error(message || 'Unable to save task right now. Please try again.')
    },
  })
  const isBusy = isSubmitting || isSaving || isSubmittingAsync
  const titleError = getFieldError('title')
  const assignedUserError = getFieldError('assignedUserId')
  const dueDateError = getFieldError('dueDate')
  const priorityError = getFieldError('priority')
  const statusError = getFieldError('status')
  const descriptionError = getFieldError('description')

  const handleFormSubmit = async (values) => {
    if (!hasAssignees) {
      setErrorMessage('No assignees available. Add users before creating tasks.')
      return
    }

    await executeSubmission(async () => {
      await onSubmit(buildTaskPayload(values))
    })
  }

  return (
    <form className="task-form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="task-form__grid">
        <TextInput
          id="task-title"
          label="Title"
          placeholder="Task title"
          registration={register('title')}
          error={titleError}
          fieldClassName="task-form__field"
          errorClassName="task-form__error"
        />

        <SelectInput
          id="task-assigned-user"
          label="Assigned user"
          disabled={!hasAssignees}
          placeholder="Select assignee"
          registration={register('assignedUserId')}
          error={assignedUserError}
          fieldClassName="task-form__field"
          errorClassName="task-form__error"
          options={assigneeOptions.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          helperText={hasAssignees ? 'Select ownership for this task.' : ''}
        />

        <DateInput
          id="task-due-date"
          label="Due date"
          registration={register('dueDate')}
          error={dueDateError}
          fieldClassName="task-form__field"
          errorClassName="task-form__error"
        />

        <SelectInput
          id="task-priority"
          label="Priority"
          registration={register('priority')}
          error={priorityError}
          fieldClassName="task-form__field"
          errorClassName="task-form__error"
          options={TASK_PRIORITY_OPTIONS.map((priority) => ({
            value: priority.id,
            label: priority.label,
          }))}
        />

        <SelectInput
          id="task-status"
          label="Status"
          registration={register('status')}
          error={statusError}
          fieldClassName="task-form__field"
          errorClassName="task-form__error"
          options={TASK_STATUS_OPTIONS.map((status) => ({
            value: status.id,
            label: status.label,
          }))}
        />

        <TextArea
          id="task-description"
          label="Description"
          rows={4}
          placeholder="Describe the expected work and outcome."
          registration={register('description')}
          error={descriptionError}
          fieldClassName="task-form__field task-form__field--full"
          errorClassName="task-form__error"
        />
      </div>

      <FormFeedback
        isLoading={isBusy}
        loadingText={isEditMode ? 'Saving task...' : 'Creating task...'}
        warningMessage={!hasAssignees ? 'No users available for assignment yet.' : ''}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />

      <div className="task-form__actions">
        <button className="task-form__submit" type="submit" disabled={isBusy || !hasAssignees}>
          {isBusy ? (isEditMode ? 'Saving...' : 'Creating...') : isEditMode ? 'Save task' : 'Create task'}
        </button>
      </div>
    </form>
  )
}

export default TaskForm
