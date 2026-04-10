import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DetailSkeleton from '../../../components/ui/DetailSkeleton.jsx'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { deleteDeal, getDealById } from '../../../services/deals.js'
import { extractEntity, getDisplayValue, resolveEntityId } from '../../../lib/crm/entityUtils.js'
import { useConfirm } from '../../../lib/confirm/useConfirm.js'
import { useToast } from '../../../lib/toast/useToast.js'
import '../../../components/crud/crud.css'

function DealDetailPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const confirm = useConfirm()
  const toast = useToast()
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
      toast.success('Deal deleted successfully.')
      navigate('/deals', { replace: true })
    },
    onError: (error) => {
      toast.error(error?.message || 'Unable to delete deal right now. Please try again.')
    },
  })

  const deal = extractEntity(dealQuery.data)
  const resolvedDealId = resolveEntityId(deal) || dealId

  const handleDelete = async () => {
    if (!resolvedDealId || deleteMutation.isPending) {
      return
    }

    const isConfirmed = await confirm({
      title: 'Delete deal?',
      description: 'This action permanently removes the deal and cannot be undone.',
      confirmLabel: 'Delete deal',
      cancelLabel: 'Cancel',
      tone: 'danger',
    })
    if (!isConfirmed) {
      return
    }

    await deleteMutation.mutateAsync(resolvedDealId)
  }

  if (dealQuery.isPending) {
    return (
      <PageContainer>
        <WidgetContainer eyebrow="Deals" title="Deal details" meta="Loading record">
          <DetailSkeleton fields={6} />
        </WidgetContainer>
      </PageContainer>
    )
  }

  if (dealQuery.isError || !deal) {
    return (
      <PageContainer>
        <ErrorState
          eyebrow="Deals"
          title="Unable to load deal"
          error={dealQuery.error}
          description="Deal not found."
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
