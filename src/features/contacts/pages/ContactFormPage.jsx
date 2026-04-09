import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { getAccounts } from '../../../services/accounts.js'
import { createContact, getContactById, updateContact } from '../../../services/contacts.js'
import ContactForm from '../components/ContactForm.jsx'
import { getContactFormValues } from '../schemas/contactSchema.js'
import './ContactFormPage.css'

function extractContactId(payload) {
  return payload?.id ?? payload?.contact?.id ?? payload?.data?.id ?? null
}

function normalizeAccountId(account) {
  const rawId = account?.id ?? account?.value ?? account?.accountId ?? null

  if (rawId === null || rawId === undefined) {
    return ''
  }

  return String(rawId)
}

function normalizeAccountLabel(account) {
  const rawLabel = account?.name ?? account?.companyName ?? account?.title ?? account?.label ?? null

  if (typeof rawLabel === 'string' && rawLabel.trim()) {
    return rawLabel.trim()
  }

  const fallbackId = normalizeAccountId(account)
  return fallbackId ? `Account ${fallbackId}` : 'Unknown account'
}

function extractAccountRows(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.accounts)) {
    return payload.accounts
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload?.results)) {
    return payload.results
  }

  return []
}

function buildAccountOptions(payload) {
  return extractAccountRows(payload)
    .map((account) => ({
      value: normalizeAccountId(account),
      label: normalizeAccountLabel(account),
    }))
    .filter((option) => option.value)
}

function ContactFormPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { contactId } = useParams()
  const isEditMode = Boolean(contactId)

  const contactQuery = useQuery({
    queryKey: ['contact', contactId],
    queryFn: () => getContactById(contactId),
    enabled: isEditMode,
  })

  const accountsQuery = useQuery({
    queryKey: ['accounts', 'contact-form-options'],
    queryFn: () => getAccounts({ pageSize: 200 }),
  })

  const createMutation = useMutation({
    mutationFn: createContact,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateContact(id, payload),
  })

  const initialValues = useMemo(() => getContactFormValues(contactQuery.data), [contactQuery.data])

  const accountOptions = useMemo(() => {
    const options = buildAccountOptions(accountsQuery.data)
    const fallbackAccountId = initialValues.accountId

    if (!fallbackAccountId) {
      return options
    }

    if (options.some((option) => option.value === fallbackAccountId)) {
      return options
    }

    const fallbackLabel =
      normalizeAccountLabel(contactQuery.data?.contact?.account ?? contactQuery.data?.data?.account) ||
      `Account ${fallbackAccountId}`

    return [{ value: fallbackAccountId, label: fallbackLabel }, ...options]
  }, [accountsQuery.data, contactQuery.data, initialValues.accountId])

  const handleSubmit = async (values) => {
    if (isEditMode) {
      await updateMutation.mutateAsync({
        id: contactId,
        payload: values,
      })

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['contacts'] }),
        queryClient.invalidateQueries({ queryKey: ['contact', contactId] }),
      ])
      return
    }

    const createdContact = await createMutation.mutateAsync(values)
    const nextContactId = extractContactId(createdContact)

    await queryClient.invalidateQueries({ queryKey: ['contacts'] })
    if (nextContactId) {
      await queryClient.invalidateQueries({ queryKey: ['contact', nextContactId] })
    }

    if (nextContactId) {
      navigate(`/contacts/${nextContactId}/edit`, { replace: true })
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending
  const isLoadingData = accountsQuery.isPending || (isEditMode && contactQuery.isPending)
  const hasLoadError = accountsQuery.isError || (isEditMode && contactQuery.isError)

  if (isLoadingData) {
    return (
      <PageContainer className="contact-form-page">
        <LoadingState
          title={isEditMode ? 'Loading contact' : 'Loading accounts'}
          description={
            isEditMode
              ? 'Fetching contact and account details so you can edit this record.'
              : 'Fetching account relations so you can link this contact.'
          }
          eyebrow="Contacts"
        />
      </PageContainer>
    )
  }

  if (hasLoadError) {
    return (
      <PageContainer className="contact-form-page">
        <ErrorState
          eyebrow="Contacts"
          title="Unable to load form data"
          description={
            contactQuery.error?.message ??
            accountsQuery.error?.message ??
            'Please try again in a few seconds.'
          }
          onRetry={() => {
            if (isEditMode) {
              contactQuery.refetch()
            }
            accountsQuery.refetch()
          }}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer className="contact-form-page">
      <WidgetContainer
        className="contact-form-panel"
        eyebrow="Contacts"
        title={isEditMode ? 'Edit contact' : 'Create contact'}
        meta={isEditMode ? `Contact ID: ${contactId}` : 'Capture stakeholder and account relation details'}
      >
        <p className="contact-form-page__description">
          {isEditMode
            ? 'Update contact details and keep the relationship mapped to the correct account.'
            : 'Create a contact and link the person to an existing account.'}
        </p>

        <ContactForm
          key={isEditMode ? `contact-edit-${contactId}` : 'contact-create'}
          mode={isEditMode ? 'edit' : 'create'}
          initialValues={initialValues}
          accountOptions={accountOptions}
          isSaving={isSaving}
          onSubmit={handleSubmit}
        />
      </WidgetContainer>
    </PageContainer>
  )
}

export default ContactFormPage
