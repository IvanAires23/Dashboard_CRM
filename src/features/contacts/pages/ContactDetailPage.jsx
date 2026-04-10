import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DetailSkeleton from '../../../components/ui/DetailSkeleton.jsx'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { deleteContact, getContactById } from '../../../services/contacts.js'
import { extractEntity, getDisplayValue, resolveEntityId } from '../../../lib/crm/entityUtils.js'
import { useConfirm } from '../../../lib/confirm/useConfirm.js'
import { useToast } from '../../../lib/toast/useToast.js'
import '../../../components/crud/crud.css'

function ContactDetailPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const confirm = useConfirm()
  const toast = useToast()
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
      toast.success('Contact deleted successfully.')
      navigate('/contacts', { replace: true })
    },
    onError: (error) => {
      toast.error(error?.message || 'Unable to delete contact right now. Please try again.')
    },
  })

  const contact = extractEntity(contactQuery.data)
  const resolvedContactId = resolveEntityId(contact) || contactId

  const handleDelete = async () => {
    if (!resolvedContactId || deleteMutation.isPending) {
      return
    }

    const isConfirmed = await confirm({
      title: 'Delete contact?',
      description: 'This action permanently removes the contact and cannot be undone.',
      confirmLabel: 'Delete contact',
      cancelLabel: 'Cancel',
      tone: 'danger',
    })
    if (!isConfirmed) {
      return
    }

    await deleteMutation.mutateAsync(resolvedContactId)
  }

  if (contactQuery.isPending) {
    return (
      <PageContainer>
        <WidgetContainer eyebrow="Contacts" title="Contact details" meta="Loading record">
          <DetailSkeleton fields={4} />
        </WidgetContainer>
      </PageContainer>
    )
  }

  if (contactQuery.isError || !contact) {
    return (
      <PageContainer>
        <ErrorState
          eyebrow="Contacts"
          title="Unable to load contact"
          error={contactQuery.error}
          description="Contact not found."
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
