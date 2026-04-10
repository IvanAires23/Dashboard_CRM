import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import EntityEmptyState from '../../../components/ui/EntityEmptyState.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { extractCollection } from '../../../lib/crm/entityUtils.js'
import { useMoveDealStage } from '../api/useMoveDealStage.js'
import { getDeals } from '../../../services/deals.js'
import PipelineBoard from '../components/PipelineBoard.jsx'
import PipelineSkeleton from '../components/PipelineSkeleton.jsx'
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
        <WidgetContainer
          className="pipeline-page__panel"
          eyebrow="Deals"
          title="Sales pipeline board"
          meta="Loading deals"
        >
          <PipelineSkeleton columns={DEAL_PIPELINE_STAGES.length} cardsPerColumn={3} />
        </WidgetContainer>
      </PageContainer>
    )
  }

  if (dealsQuery.isError) {
    return (
      <PageContainer className="pipeline-page">
        <ErrorState
          eyebrow="Deals"
          title="Unable to load pipeline board"
          error={dealsQuery.error}
          description="Please try again in a few seconds."
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
          Visual flow of opportunities across shared pipeline stages. Drag deals between columns to
          update stage movement quickly.
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
            error={moveStageMutation.error}
            description="Please retry moving the deal."
          />
        ) : null}

        {rows.length ? (
          <PipelineBoard
            columns={stageColumns}
            isStageUpdating={moveStageMutation.isPending}
            onDealStageChange={handleMoveDealStage}
          />
        ) : (
          <EntityEmptyState
            entityLabel="deals"
            title="No deals in pipeline yet"
            description="Create your first deal to populate the board and start tracking stage movement."
            createHref="/deals/new"
            createLabel="Create deal"
            eyebrow="Pipeline"
          />
        )}
      </WidgetContainer>
    </PageContainer>
  )
}

export default PipelinePage
