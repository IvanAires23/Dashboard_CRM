import { useEffect, useMemo } from 'react'
import { DateInput, SelectInput, TextInput } from '../../../components/form/index.js'
import FormFeedback from '../../../lib/forms/FormFeedback.jsx'
import { useAsyncFormSubmission } from '../../../lib/forms/submission.js'
import { useZodForm } from '../../../lib/forms/useZodForm.js'
import { DEAL_PIPELINE_STAGES, dealDefaultValues, dealSchema, getDealFormValues } from '../schemas/dealSchema.js'
import './DealForm.css'

function DealForm({
  mode = 'create',
  initialValues,
  isSaving = false,
  onSubmit = async () => {},
}) {
  const resolvedInitialValues = useMemo(
    () => getDealFormValues(initialValues ?? dealDefaultValues),
    [initialValues],
  )

  const {
    register,
    handleSubmit,
    reset,
    getFieldError,
    formState: { isSubmitting },
  } = useZodForm({
    schema: dealSchema,
    defaultValues: resolvedInitialValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  useEffect(() => {
    reset(resolvedInitialValues)
  }, [reset, resolvedInitialValues])

  const isEditMode = mode === 'edit'
  const {
    isSubmittingAsync,
    successMessage,
    errorMessage,
    executeSubmission,
  } = useAsyncFormSubmission({
    successMessage: isEditMode ? 'Deal updated successfully.' : 'Deal created successfully.',
    defaultErrorMessage: 'Unable to save deal right now. Please try again.',
  })
  const isBusy = isSubmitting || isSaving || isSubmittingAsync
  const titleError = getFieldError('title')
  const valueError = getFieldError('value')
  const stageError = getFieldError('stage')
  const accountError = getFieldError('account')
  const contactError = getFieldError('contact')
  const expectedCloseDateError = getFieldError('expectedCloseDate')

  const handleFormSubmit = async (values) => {
    await executeSubmission(async () => {
      await onSubmit(values)
    })
  }

  return (
    <form className="deal-form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="deal-form__grid">
        <TextInput
          id="deal-title"
          label="Title"
          placeholder="Deal title"
          registration={register('title')}
          error={titleError}
          fieldClassName="deal-form__field"
          errorClassName="deal-form__error"
        />

        <TextInput
          id="deal-value"
          type="number"
          label="Value"
          step="0.01"
          min="0"
          placeholder="0.00"
          registration={register('value')}
          error={valueError}
          fieldClassName="deal-form__field"
          errorClassName="deal-form__error"
        />

        <SelectInput
          id="deal-stage"
          label="Pipeline stage"
          registration={register('stage')}
          error={stageError}
          fieldClassName="deal-form__field"
          errorClassName="deal-form__error"
          options={DEAL_PIPELINE_STAGES.map((stage) => ({
            value: stage.id,
            label: stage.label,
          }))}
          helperText="Moves the opportunity through standardized pipeline steps."
        />

        <TextInput
          id="deal-account"
          label="Account"
          placeholder="Account"
          registration={register('account')}
          error={accountError}
          fieldClassName="deal-form__field"
          errorClassName="deal-form__error"
        />

        <TextInput
          id="deal-contact"
          label="Contact"
          placeholder="Contact"
          registration={register('contact')}
          error={contactError}
          fieldClassName="deal-form__field"
          errorClassName="deal-form__error"
        />

        <DateInput
          id="deal-expected-close-date"
          label="Expected close date"
          registration={register('expectedCloseDate')}
          error={expectedCloseDateError}
          fieldClassName="deal-form__field"
          errorClassName="deal-form__error"
        />
      </div>

      <FormFeedback
        isLoading={isBusy}
        loadingText={isEditMode ? 'Saving deal...' : 'Creating deal...'}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />

      <div className="deal-form__actions">
        <button className="deal-form__submit" type="submit" disabled={isBusy}>
          {isBusy ? (isEditMode ? 'Saving...' : 'Creating...') : isEditMode ? 'Save deal' : 'Create deal'}
        </button>
      </div>
    </form>
  )
}

export default DealForm
