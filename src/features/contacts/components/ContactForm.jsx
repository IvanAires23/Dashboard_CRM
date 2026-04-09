import { useEffect, useMemo } from 'react'
import { SelectInput, TextInput } from '../../../components/form/index.js'
import FormFeedback from '../../../lib/forms/FormFeedback.jsx'
import { useAsyncFormSubmission } from '../../../lib/forms/submission.js'
import { useZodForm } from '../../../lib/forms/useZodForm.js'
import {
  buildContactPayload,
  contactDefaultValues,
  createContactSchema,
  getContactFormValues,
} from '../schemas/contactSchema.js'
import './ContactForm.css'

function ContactForm({
  mode = 'create',
  initialValues,
  accountOptions = [],
  isSaving = false,
  onSubmit = async () => {},
}) {
  const resolvedInitialValues = useMemo(
    () => getContactFormValues(initialValues ?? contactDefaultValues),
    [initialValues],
  )

  const validationSchema = useMemo(
    () => createContactSchema(accountOptions.map((option) => option.value)),
    [accountOptions],
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
  const hasAccounts = accountOptions.length > 0
  const {
    isSubmittingAsync,
    successMessage,
    errorMessage,
    executeSubmission,
    setErrorMessage,
  } = useAsyncFormSubmission({
    successMessage: isEditMode ? 'Contact updated successfully.' : 'Contact created successfully.',
    defaultErrorMessage: 'Unable to save contact right now. Please try again.',
  })
  const isBusy = isSubmitting || isSaving || isSubmittingAsync
  const nameError = getFieldError('name')
  const emailError = getFieldError('email')
  const phoneError = getFieldError('phone')
  const accountError = getFieldError('accountId')

  const handleFormSubmit = async (values) => {
    if (!hasAccounts) {
      setErrorMessage('Create an account first so this contact can be linked.')
      return
    }

    await executeSubmission(async () => {
      await onSubmit(buildContactPayload(values))
    })
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="contact-form__grid">
        <TextInput
          id="contact-name"
          label="Name"
          placeholder="Contact name"
          autoComplete="name"
          registration={register('name')}
          error={nameError}
          fieldClassName="contact-form__field"
          errorClassName="contact-form__error"
        />

        <TextInput
          id="contact-email"
          type="email"
          label="Email"
          placeholder="contact@company.com"
          autoComplete="email"
          registration={register('email')}
          error={emailError}
          fieldClassName="contact-form__field"
          errorClassName="contact-form__error"
        />

        <TextInput
          id="contact-phone"
          type="tel"
          label="Phone"
          placeholder="+1 555 123 4567"
          autoComplete="tel"
          registration={register('phone')}
          error={phoneError}
          fieldClassName="contact-form__field"
          errorClassName="contact-form__error"
        />

        <SelectInput
          id="contact-account-id"
          label="Account relation"
          disabled={!hasAccounts}
          placeholder="Select account"
          registration={register('accountId')}
          error={accountError}
          fieldClassName="contact-form__field"
          errorClassName="contact-form__error"
          options={accountOptions.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          helperText={hasAccounts ? 'Contacts must be linked to one account.' : ''}
        />
      </div>

      <FormFeedback
        isLoading={isBusy}
        loadingText={isEditMode ? 'Saving contact...' : 'Creating contact...'}
        warningMessage={
          !hasAccounts ? 'No accounts found. Create an account before creating contacts.' : ''
        }
        successMessage={successMessage}
        errorMessage={errorMessage}
      />

      <div className="contact-form__actions">
        <button className="contact-form__submit" type="submit" disabled={isBusy || !hasAccounts}>
          {isBusy ? (isEditMode ? 'Saving...' : 'Creating...') : isEditMode ? 'Save contact' : 'Create contact'}
        </button>
      </div>
    </form>
  )
}

export default ContactForm
