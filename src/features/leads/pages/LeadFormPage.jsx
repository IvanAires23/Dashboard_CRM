import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { createLead, getLeadById, updateLead } from '../../../services/leads.js'
import LeadForm from '../components/LeadForm.jsx'
import { getLeadFormValues } from '../schemas/leadSchema.js'
import './LeadFormPage.css'

function extractLeadId(payload) {
  return payload?.id ?? payload?.lead?.id ?? payload?.data?.id ?? null
}

function LeadFormPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { leadId } = useParams()
  const isEditMode = Boolean(leadId)

  const leadQuery = useQuery({
    queryKey: ['lead', leadId],
    queryFn: () => getLeadById(leadId),
    enabled: isEditMode,
  })

  const createMutation = useMutation({
    mutationFn: createLead,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateLead(id, payload),
  })

  const initialValues = useMemo(() => getLeadFormValues(leadQuery.data), [leadQuery.data])

  const handleSubmit = async (values) => {
    if (isEditMode) {
      await updateMutation.mutateAsync({
        id: leadId,
        payload: values,
      })

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['leads'] }),
        queryClient.invalidateQueries({ queryKey: ['lead', leadId] }),
      ])
      return
    }

    const createdLead = await createMutation.mutateAsync(values)
    const nextLeadId = extractLeadId(createdLead)

    await queryClient.invalidateQueries({ queryKey: ['leads'] })
    if (nextLeadId) {
      await queryClient.invalidateQueries({ queryKey: ['lead', nextLeadId] })
    }

    if (nextLeadId) {
      navigate(`/leads/${nextLeadId}/edit`, { replace: true })
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  if (isEditMode && leadQuery.isPending) {
    return (
      <PageContainer className="lead-form-page">
        <LoadingState
          title="Loading lead"
          description="Fetching lead details so you can edit this record."
          eyebrow="Leads"
        />
      </PageContainer>
    )
  }

  if (isEditMode && leadQuery.isError) {
    return (
      <PageContainer className="lead-form-page">
        <ErrorState
          eyebrow="Leads"
          title="Unable to load lead"
          description={leadQuery.error?.message || 'Please try again in a few seconds.'}
          onRetry={leadQuery.refetch}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer className="lead-form-page">
      <WidgetContainer
        className="lead-form-panel"
        eyebrow="Leads"
        title={isEditMode ? 'Edit lead' : 'Create lead'}
        meta={isEditMode ? `Lead ID: ${leadId}` : 'Capture lead profile and qualification details'}
      >
        <p className="lead-form-page__description">
          {isEditMode
            ? 'Update contact details, qualification stage and attribution source.'
            : 'Create a new lead with validated contact and pipeline information.'}
        </p>

        <LeadForm
          key={isEditMode ? `lead-edit-${leadId}` : 'lead-create'}
          mode={isEditMode ? 'edit' : 'create'}
          initialValues={initialValues}
          isSaving={isSaving}
          onSubmit={handleSubmit}
        />
      </WidgetContainer>
    </PageContainer>
  )
}

export default LeadFormPage
