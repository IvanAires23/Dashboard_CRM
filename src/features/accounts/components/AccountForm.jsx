import { useEffect, useMemo } from 'react'
import { TextInput } from '../../../components/form/index.js'
import FormFeedback from '../../../lib/forms/FormFeedback.jsx'
import { useAsyncFormSubmission } from '../../../lib/forms/submission.js'
import { useZodForm } from '../../../lib/forms/useZodForm.js'
import { accountDefaultValues, accountSchema, getAccountFormValues } from '../schemas/accountSchema.js'
import './AccountForm.css'

function AccountForm({
  mode = 'create',
  initialValues,
  isSaving = false,
  onSubmit = async () => {},
}) {
  const resolvedInitialValues = useMemo(
    () => getAccountFormValues(initialValues ?? accountDefaultValues),
    [initialValues],
  )

  const {
    register,
    handleSubmit,
    reset,
    getFieldError,
    formState: { isSubmitting },
  } = useZodForm({
    schema: accountSchema,
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
    successMessage: isEditMode ? 'Account updated successfully.' : 'Account created successfully.',
    defaultErrorMessage: 'Unable to save account right now. Please try again.',
  })
  const isBusy = isSubmitting || isSaving || isSubmittingAsync
  const nameError = getFieldError('name')
  const industryError = getFieldError('industry')
  const sizeError = getFieldError('size')
  const websiteError = getFieldError('website')

  const handleFormSubmit = async (values) => {
    await executeSubmission(async () => {
      await onSubmit(values)
    })
  }

  return (
    <form className="account-form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="account-form__grid">
        <TextInput
          id="account-name"
          label="Name"
          placeholder="Account name"
          autoComplete="organization"
          registration={register('name')}
          error={nameError}
          fieldClassName="account-form__field"
          errorClassName="account-form__error"
        />

        <TextInput
          id="account-industry"
          label="Industry"
          placeholder="Industry"
          registration={register('industry')}
          error={industryError}
          fieldClassName="account-form__field"
          errorClassName="account-form__error"
        />

        <TextInput
          id="account-size"
          type="number"
          label="Size"
          min="1"
          step="1"
          placeholder="Employees"
          registration={register('size')}
          error={sizeError}
          helperText="Number of employees."
          fieldClassName="account-form__field"
          errorClassName="account-form__error"
        />

        <TextInput
          id="account-website"
          type="url"
          label="Website"
          placeholder="https://example.com"
          autoComplete="url"
          registration={register('website')}
          error={websiteError}
          fieldClassName="account-form__field"
          errorClassName="account-form__error"
        />
      </div>

      <FormFeedback
        isLoading={isBusy}
        loadingText={isEditMode ? 'Saving account...' : 'Creating account...'}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />

      <div className="account-form__actions">
        <button className="account-form__submit" type="submit" disabled={isBusy}>
          {isBusy ? (isEditMode ? 'Saving...' : 'Creating...') : isEditMode ? 'Save account' : 'Create account'}
        </button>
      </div>
    </form>
  )
}

export default AccountForm
