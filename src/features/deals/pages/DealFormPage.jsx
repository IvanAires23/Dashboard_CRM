import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { createDeal, getDealById, moveDealStage, updateDeal } from '../../../services/deals.js'
import DealForm from '../components/DealForm.jsx'
import { getDealFormValues } from '../schemas/dealSchema.js'
import './DealFormPage.css'

function extractDealId(payload) {
  return payload?.id ?? payload?.deal?.id ?? payload?.data?.id ?? null
}

function buildDealPayload(values) {
  return {
    ...values,
    value: Number(values.value),
    amount: Number(values.value),
    stageId: values.stage,
    closeDate: values.expectedCloseDate,
    expected_close_date: values.expectedCloseDate,
  }
}

function DealFormPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { dealId } = useParams()
  const isEditMode = Boolean(dealId)

  const dealQuery = useQuery({
    queryKey: ['deal', dealId],
    queryFn: () => getDealById(dealId),
    enabled: isEditMode,
  })

  const createMutation = useMutation({
    mutationFn: createDeal,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateDeal(id, payload),
  })

  const moveStageMutation = useMutation({
    mutationFn: ({ id, stageId }) => moveDealStage(id, stageId),
  })

  const initialValues = useMemo(() => getDealFormValues(dealQuery.data), [dealQuery.data])

  const handleSubmit = async (values) => {
    const payload = buildDealPayload(values)

    if (isEditMode) {
      await updateMutation.mutateAsync({
        id: dealId,
        payload,
      })

      if (initialValues.stage !== values.stage) {
        await moveStageMutation.mutateAsync({
          id: dealId,
          stageId: values.stage,
        })
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['deals'] }),
        queryClient.invalidateQueries({ queryKey: ['deal', dealId] }),
      ])

      return
    }

    const createdDeal = await createMutation.mutateAsync(payload)
    const nextDealId = extractDealId(createdDeal)

    await queryClient.invalidateQueries({ queryKey: ['deals'] })
    if (nextDealId) {
      await queryClient.invalidateQueries({ queryKey: ['deal', nextDealId] })
    }

    if (nextDealId) {
      navigate(`/deals/${nextDealId}/edit`, { replace: true })
    }
  }

  const isSaving =
    createMutation.isPending || updateMutation.isPending || moveStageMutation.isPending

  if (isEditMode && dealQuery.isPending) {
    return (
      <PageContainer className="deal-form-page">
        <LoadingState
          title="Loading deal"
          description="Fetching deal details so you can edit this record."
          eyebrow="Deals"
        />
      </PageContainer>
    )
  }

  if (isEditMode && dealQuery.isError) {
    return (
      <PageContainer className="deal-form-page">
        <ErrorState
          eyebrow="Deals"
          title="Unable to load deal"
          description={dealQuery.error?.message || 'Please try again in a few seconds.'}
          onRetry={dealQuery.refetch}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer className="deal-form-page">
      <WidgetContainer
        className="deal-form-panel"
        eyebrow="Deals"
        title={isEditMode ? 'Edit deal' : 'Create deal'}
        meta={isEditMode ? `Deal ID: ${dealId}` : 'Capture value, stage and ownership details'}
      >
        <p className="deal-form-page__description">
          {isEditMode
            ? 'Update opportunity details and move the deal through predefined pipeline stages.'
            : 'Create a deal record with validated value, stage, account and timeline information.'}
        </p>

        <DealForm
          key={isEditMode ? `deal-edit-${dealId}` : 'deal-create'}
          mode={isEditMode ? 'edit' : 'create'}
          initialValues={initialValues}
          isSaving={isSaving}
          onSubmit={handleSubmit}
        />
      </WidgetContainer>
    </PageContainer>
  )
}

export default DealFormPage
