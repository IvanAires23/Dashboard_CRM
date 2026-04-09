import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { extractCollection } from '../../../lib/crm/entityUtils.js'
import { useMoveDealStage } from '../api/useMoveDealStage.js'
import { getDeals } from '../../../services/deals.js'
import PipelineBoard from '../components/PipelineBoard.jsx'
import { groupDealsByStage } from '../lib/groupDealsByStage.js'
import { DEAL_PIPELINE_STAGES } from '../schemas/dealSchema.js'
import './PipelinePage.css'

function PipelinePage() {
  const moveStageMutation = useMoveDealStage()

  const dealsQuery = useQuery({
    queryKey: ['deals'],
    queryFn: () => getDeals({ pageSize: 300 }),
  })

  const rows = useMemo(() => extractCollection(dealsQuery.data), [dealsQuery.data])
  const stageColumns = useMemo(
    () => groupDealsByStage(rows, DEAL_PIPELINE_STAGES),
    [rows],
  )

  const handleMoveDealStage = async ({ dealId, toStageId }) => {
    await moveStageMutation.mutateAsync({
      dealId,
      stageId: toStageId,
    })
  }

  if (dealsQuery.isPending) {
    return (
      <PageContainer className="pipeline-page">
        <LoadingState
          eyebrow="Deals"
          title="Loading pipeline board"
          description="Fetching deals and grouping opportunities by stage."
        />
      </PageContainer>
    )
  }

  if (dealsQuery.isError) {
    return (
      <PageContainer className="pipeline-page">
        <ErrorState
          eyebrow="Deals"
          title="Unable to load pipeline board"
          description={dealsQuery.error?.message || 'Please try again in a few seconds.'}
          onRetry={dealsQuery.refetch}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer className="pipeline-page">
      {dealsQuery.isFetching ? (
        <LoadingState
          contained={false}
          eyebrow="Deals"
          title="Refreshing pipeline board"
          description="Syncing deals and stage totals."
        />
      ) : null}

      <WidgetContainer
        className="pipeline-page__panel"
        eyebrow="Deals"
        title="Sales pipeline board"
        meta={`${rows.length} deals`}
      >
        <p className="pipeline-page__intro">
          Visual flow of opportunities across shared pipeline stages. Structure is prepared for
          drag-and-drop stage movement in the next step.
        </p>

        <div className="pipeline-page__toolbar">
          <Link className="state-action" to="/deals">
            Deals list
          </Link>
          <Link className="state-action" to="/deals/new">
            Create deal
          </Link>
        </div>

        {moveStageMutation.isPending ? (
          <LoadingState
            contained={false}
            eyebrow="Deals"
            title="Updating deal stage"
            description="Applying stage movement..."
          />
        ) : null}

        {moveStageMutation.isError ? (
          <ErrorState
            contained={false}
            eyebrow="Deals"
            title="Unable to move deal"
            description={moveStageMutation.error?.message || 'Please retry moving the deal.'}
          />
        ) : null}

        <PipelineBoard
          columns={stageColumns}
          isStageUpdating={moveStageMutation.isPending}
          onDealStageChange={handleMoveDealStage}
        />
      </WidgetContainer>
    </PageContainer>
  )
}

export default PipelinePage
