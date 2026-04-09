import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { deleteLead, getLeadById } from '../../../services/leads.js'
import { extractEntity, getDisplayValue, resolveEntityId } from '../../../lib/crm/entityUtils.js'
import '../../../components/crud/crud.css'

function LeadDetailPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { leadId } = useParams()

  const leadQuery = useQuery({
    queryKey: ['lead', leadId],
    queryFn: () => getLeadById(leadId),
    enabled: Boolean(leadId),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      navigate('/leads', { replace: true })
    },
  })

  const lead = extractEntity(leadQuery.data)
  const resolvedLeadId = resolveEntityId(lead) || leadId

  const handleDelete = async () => {
    if (!resolvedLeadId || deleteMutation.isPending) {
      return
    }

    const shouldDelete = window.confirm('Delete this lead? This action cannot be undone.')
    if (!shouldDelete) {
      return
    }

    await deleteMutation.mutateAsync(resolvedLeadId)
  }

  if (leadQuery.isPending) {
    return (
      <PageContainer>
        <LoadingState eyebrow="Leads" title="Loading lead" description="Fetching lead details." />
      </PageContainer>
    )
  }

  if (leadQuery.isError || !lead) {
    return (
      <PageContainer>
        <ErrorState
          eyebrow="Leads"
          title="Unable to load lead"
          description={leadQuery.error?.message || 'Lead not found.'}
          onRetry={leadQuery.refetch}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <WidgetContainer
        eyebrow="Leads"
        title={lead?.name || 'Lead details'}
        meta={`Lead ID: ${resolvedLeadId || '—'}`}
      >
        <div className="crud-detail">
          <dl className="crud-detail__grid">
            <div className="crud-detail__item">
              <dt>Name</dt>
              <dd>{getDisplayValue(lead?.name)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Email</dt>
              <dd>{getDisplayValue(lead?.email)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Phone</dt>
              <dd>{getDisplayValue(lead?.phone)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Company</dt>
              <dd>{getDisplayValue(lead?.company)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Status</dt>
              <dd>{getDisplayValue(lead?.status)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Source</dt>
              <dd>{getDisplayValue(lead?.source)}</dd>
            </div>
          </dl>

          <div className="crud-detail__actions">
            <Link to="/leads">Back</Link>
            <Link className="primary" to={`/leads/${resolvedLeadId}/edit`}>
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

export default LeadDetailPage
