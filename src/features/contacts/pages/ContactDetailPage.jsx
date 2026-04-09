import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { deleteContact, getContactById } from '../../../services/contacts.js'
import { extractEntity, getDisplayValue, resolveEntityId } from '../../../lib/crm/entityUtils.js'
import '../../../components/crud/crud.css'

function ContactDetailPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { contactId } = useParams()

  const contactQuery = useQuery({
    queryKey: ['contact', contactId],
    queryFn: () => getContactById(contactId),
    enabled: Boolean(contactId),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      navigate('/contacts', { replace: true })
    },
  })

  const contact = extractEntity(contactQuery.data)
  const resolvedContactId = resolveEntityId(contact) || contactId

  const handleDelete = async () => {
    if (!resolvedContactId || deleteMutation.isPending) {
      return
    }

    const shouldDelete = window.confirm('Delete this contact? This action cannot be undone.')
    if (!shouldDelete) {
      return
    }

    await deleteMutation.mutateAsync(resolvedContactId)
  }

  if (contactQuery.isPending) {
    return (
      <PageContainer>
        <LoadingState eyebrow="Contacts" title="Loading contact" description="Fetching contact details." />
      </PageContainer>
    )
  }

  if (contactQuery.isError || !contact) {
    return (
      <PageContainer>
        <ErrorState
          eyebrow="Contacts"
          title="Unable to load contact"
          description={contactQuery.error?.message || 'Contact not found.'}
          onRetry={contactQuery.refetch}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <WidgetContainer
        eyebrow="Contacts"
        title={contact?.name ?? contact?.fullName ?? 'Contact details'}
        meta={`Contact ID: ${resolvedContactId || '—'}`}
      >
        <div className="crud-detail">
          <dl className="crud-detail__grid">
            <div className="crud-detail__item">
              <dt>Name</dt>
              <dd>{getDisplayValue(contact?.name ?? contact?.fullName)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Email</dt>
              <dd>{getDisplayValue(contact?.email)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Phone</dt>
              <dd>{getDisplayValue(contact?.phone ?? contact?.mobile)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Account relation</dt>
              <dd>{getDisplayValue(contact?.account?.name ?? contact?.company?.name ?? contact?.accountId ?? contact?.company)}</dd>
            </div>
          </dl>

          <div className="crud-detail__actions">
            <Link to="/contacts">Back</Link>
            <Link className="primary" to={`/contacts/${resolvedContactId}/edit`}>
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

export default ContactDetailPage
