import ErrorState from '../../../components/ui/ErrorState.jsx'
import EmptyState from '../../../components/ui/EmptyState.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import { useDashboardData } from '../api/useDashboardData.js'
import DashboardContent from '../components/DashboardContent.jsx'
import '../DashboardPage.css'

function DashboardPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboardData()

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState
          eyebrow="Dashboard"
          title="Loading dashboard data"
          description="Fetching the latest CRM metrics and account signals."
        />
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer>
        <ErrorState
          eyebrow="Dashboard"
          title="Unable to load dashboard data"
          description={error?.message || 'Please try again in a few seconds.'}
          onRetry={refetch}
        />
      </PageContainer>
    )
  }

  const hasData =
    Boolean(data?.performanceCards?.length) ||
    Boolean(data?.pipelineStages?.length) ||
    Boolean(data?.activityFeed?.length) ||
    Boolean(data?.accountRows?.length)

  if (!hasData) {
    return (
      <PageContainer>
        <EmptyState
          eyebrow="Dashboard"
          title="No dashboard data available"
          description="There is no information to display yet. Try refreshing in a moment."
          actionLabel="Refresh data"
          onAction={refetch}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {isFetching ? (
        <LoadingState
          contained={false}
          eyebrow="Dashboard"
          title="Refreshing dashboard"
          description="Updating metrics with the latest available data."
        />
      ) : null}

      <DashboardContent
        accountRows={data?.accountRows ?? []}
        activityFeed={data?.activityFeed ?? []}
        performanceCards={data?.performanceCards ?? []}
        pipelineStages={data?.pipelineStages ?? []}
      />
    </PageContainer>
  )
}

export default DashboardPage
