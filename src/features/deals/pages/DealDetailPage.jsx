import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { deleteDeal, getDealById } from '../../../services/deals.js'
import { extractEntity, getDisplayValue, resolveEntityId } from '../../../lib/crm/entityUtils.js'
import '../../../components/crud/crud.css'

function DealDetailPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { dealId } = useParams()

  const dealQuery = useQuery({
    queryKey: ['deal', dealId],
    queryFn: () => getDealById(dealId),
    enabled: Boolean(dealId),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
      navigate('/deals', { replace: true })
    },
  })

  const deal = extractEntity(dealQuery.data)
  const resolvedDealId = resolveEntityId(deal) || dealId

  const handleDelete = async () => {
    if (!resolvedDealId || deleteMutation.isPending) {
      return
    }

    const shouldDelete = window.confirm('Delete this deal? This action cannot be undone.')
    if (!shouldDelete) {
      return
    }

    await deleteMutation.mutateAsync(resolvedDealId)
  }

  if (dealQuery.isPending) {
    return (
      <PageContainer>
        <LoadingState eyebrow="Deals" title="Loading deal" description="Fetching deal details." />
      </PageContainer>
    )
  }

  if (dealQuery.isError || !deal) {
    return (
      <PageContainer>
        <ErrorState
          eyebrow="Deals"
          title="Unable to load deal"
          description={dealQuery.error?.message || 'Deal not found.'}
          onRetry={dealQuery.refetch}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <WidgetContainer
        eyebrow="Deals"
        title={deal?.title ?? deal?.name ?? 'Deal details'}
        meta={`Deal ID: ${resolvedDealId || '—'}`}
      >
        <div className="crud-detail">
          <dl className="crud-detail__grid">
            <div className="crud-detail__item">
              <dt>Title</dt>
              <dd>{getDisplayValue(deal?.title ?? deal?.name)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Value</dt>
              <dd>{getDisplayValue(deal?.value ?? deal?.amount)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Stage</dt>
              <dd>{getDisplayValue(deal?.stage ?? deal?.stageId ?? deal?.pipelineStage)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Account</dt>
              <dd>{getDisplayValue(deal?.account?.name ?? deal?.account ?? deal?.accountId)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Contact</dt>
              <dd>{getDisplayValue(deal?.contact?.name ?? deal?.contact ?? deal?.contactId)}</dd>
            </div>
            <div className="crud-detail__item">
              <dt>Expected close date</dt>
              <dd>{getDisplayValue(deal?.expectedCloseDate ?? deal?.closeDate ?? deal?.expected_close_date)}</dd>
            </div>
          </dl>

          <div className="crud-detail__actions">
            <Link to="/deals">Back</Link>
            <Link className="primary" to={`/deals/${resolvedDealId}/edit`}>
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

export default DealDetailPage
