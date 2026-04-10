import { useEffect, useMemo } from 'react'
import { SelectInput, TextInput } from '../../../components/form/index.js'
import FormFeedback from '../../../lib/forms/FormFeedback.jsx'
import { useAsyncFormSubmission } from '../../../lib/forms/submission.js'
import { useToast } from '../../../lib/toast/useToast.js'
import { useZodForm } from '../../../lib/forms/useZodForm.js'
import {
  getLeadFormValues,
  leadDefaultValues,
  leadSchema,
  leadSourceOptions,
  leadStatusOptions,
} from '../schemas/leadSchema.js'
import './LeadForm.css'

function toOptionLabel(value) {
  return value
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

function LeadForm({
  mode = 'create',
  initialValues,
  isSaving = false,
  onSubmit = async () => {},
}) {
  const resolvedInitialValues = useMemo(
    () => getLeadFormValues(initialValues ?? leadDefaultValues),
    [initialValues],
  )

  const {
    register,
    handleSubmit,
    reset,
    getFieldError,
    formState: { isSubmitting },
  } = useZodForm({
    schema: leadSchema,
    defaultValues: resolvedInitialValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  useEffect(() => {
    reset(resolvedInitialValues)
  }, [reset, resolvedInitialValues])

  const isEditMode = mode === 'edit'
  const toast = useToast()
  const {
    isSubmittingAsync,
    successMessage,
    errorMessage,
    executeSubmission,
  } = useAsyncFormSubmission({
    successMessage: isEditMode ? 'Lead updated successfully.' : 'Lead created successfully.',
    defaultErrorMessage: 'Unable to save lead right now. Please try again.',
    onSuccess: ({ message }) => {
      toast.success(message || 'Lead saved successfully.')
    },
    onError: ({ message }) => {
      toast.error(message || 'Unable to save lead right now. Please try again.')
    },
  })
  const isBusy = isSubmitting || isSaving || isSubmittingAsync
  const nameError = getFieldError('name')
  const emailError = getFieldError('email')
  const phoneError = getFieldError('phone')
  const companyError = getFieldError('company')
  const statusError = getFieldError('status')
  const sourceError = getFieldError('source')

  const handleFormSubmit = async (values) => {
    await executeSubmission(async () => {
      await onSubmit(values)
    })
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="lead-form__grid">
        <TextInput
          id="lead-name"
          label="Name"
          placeholder="Lead name"
          autoComplete="name"
          registration={register('name')}
          error={nameError}
          fieldClassName="lead-form__field"
          errorClassName="lead-form__error"
        />

        <TextInput
          id="lead-email"
          type="email"
          label="Email"
          placeholder="lead@company.com"
          autoComplete="email"
          registration={register('email')}
          error={emailError}
          fieldClassName="lead-form__field"
          errorClassName="lead-form__error"
        />

        <TextInput
          id="lead-phone"
          type="tel"
          label="Phone"
          placeholder="+1 555 000 1111"
          autoComplete="tel"
          registration={register('phone')}
          error={phoneError}
          fieldClassName="lead-form__field"
          errorClassName="lead-form__error"
        />

        <TextInput
          id="lead-company"
          label="Company"
          placeholder="Company name"
          autoComplete="organization"
          registration={register('company')}
          error={companyError}
          fieldClassName="lead-form__field"
          errorClassName="lead-form__error"
        />

        <SelectInput
          id="lead-status"
          label="Status"
          registration={register('status')}
          error={statusError}
          fieldClassName="lead-form__field"
          errorClassName="lead-form__error"
          options={leadStatusOptions.map((value) => ({
            value,
            label: toOptionLabel(value),
          }))}
        />

        <SelectInput
          id="lead-source"
          label="Source"
          registration={register('source')}
          error={sourceError}
          fieldClassName="lead-form__field"
          errorClassName="lead-form__error"
          options={leadSourceOptions.map((value) => ({
            value,
            label: toOptionLabel(value),
          }))}
        />
      </div>

      <FormFeedback
        isLoading={isBusy}
        loadingText={isEditMode ? 'Saving lead...' : 'Creating lead...'}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />

      <div className="lead-form__actions">
        <button className="lead-form__submit" type="submit" disabled={isBusy}>
          {isBusy ? (isEditMode ? 'Saving...' : 'Creating...') : isEditMode ? 'Save lead' : 'Create lead'}
        </button>
      </div>
    </form>
  )
}

export default LeadForm
