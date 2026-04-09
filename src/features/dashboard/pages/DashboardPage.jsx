import { useMemo, useState } from 'react'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import EmptyState from '../../../components/ui/EmptyState.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import { useDashboardQuery } from '../api/useDashboardQuery.js'
import ActivityWidget from '../components/ActivityWidget.jsx'
import AccountsTable from '../components/AccountsTable.jsx'
import ForecastChart from '../components/ForecastChart.jsx'
import KpiCards from '../components/KpiCards.jsx'
import LostDealsTrendChart from '../components/LostDealsTrendChart.jsx'
import PipelineFunnelChart from '../components/PipelineFunnelChart.jsx'
import RevenueTrendChart from '../components/RevenueTrendChart.jsx'
import StageDistributionChart from '../components/StageDistributionChart.jsx'
import TeamProductivityChart from '../components/TeamProductivityChart.jsx'
import WidgetGrid from '../components/WidgetGrid.jsx'
import {
  normalizeWidgetOrder,
  readWidgetOrder,
  reorderWidgetOrder,
  writeWidgetOrder,
} from '../lib/widgetDnd.js'
import '../DashboardPage.css'

const WIDGET_ORDER_STORAGE_KEY = 'dashboard-widget-order-v1'
const DEFAULT_WIDGET_IDS = Object.freeze([
  'pipeline-funnel',
  'stage-distribution',
  'revenue-trend',
  'forecast-trend',
  'team-productivity',
  'lost-deals-trend',
  'activity-widget',
  'accounts-widget',
])

function isSameOrder(leftOrder = [], rightOrder = []) {
  if (leftOrder.length !== rightOrder.length) {
    return false
  }

  return leftOrder.every((id, index) => id === rightOrder[index])
}

function DashboardPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboardQuery()
  const [widgetOrder, setWidgetOrder] = useState(() =>
    normalizeWidgetOrder(
      readWidgetOrder(WIDGET_ORDER_STORAGE_KEY),
      DEFAULT_WIDGET_IDS,
    ),
  )

  const widgetDefinitions = useMemo(
    () => [
      {
        id: 'pipeline-funnel',
        label: 'Pipeline funnel',
        content: <PipelineFunnelChart data={data?.pipelineFunnelSeries ?? []} />,
      },
      {
        id: 'stage-distribution',
        label: 'Stage distribution',
        content: <StageDistributionChart data={data?.stageDistributionSeries ?? []} />,
      },
      {
        id: 'revenue-trend',
        label: 'Revenue trend',
        content: <RevenueTrendChart data={data?.revenueTrendSeries ?? []} />,
      },
      {
        id: 'forecast-trend',
        label: 'Forecast trend',
        content: <ForecastChart data={data?.forecastTrendSeries ?? []} />,
      },
      {
        id: 'team-productivity',
        label: 'Team productivity',
        content: <TeamProductivityChart data={data?.teamProductivitySeries ?? []} />,
      },
      {
        id: 'lost-deals-trend',
        label: 'Lost deals trend',
        content: <LostDealsTrendChart data={data?.lostDealsTrendSeries ?? []} />,
      },
      {
        id: 'activity-widget',
        label: 'Latest activity',
        content: <ActivityWidget items={data?.activityItems ?? []} />,
      },
      {
        id: 'accounts-widget',
        label: 'Account portfolio',
        content: <AccountsTable rows={data?.accountRows ?? []} />,
      },
    ],
    [
      data?.accountRows,
      data?.activityItems,
      data?.forecastTrendSeries,
      data?.lostDealsTrendSeries,
      data?.pipelineFunnelSeries,
      data?.revenueTrendSeries,
      data?.stageDistributionSeries,
      data?.teamProductivitySeries,
    ],
  )

  const availableWidgetIds = useMemo(
    () => widgetDefinitions.map((widget) => widget.id),
    [widgetDefinitions],
  )

  const orderedWidgets = useMemo(() => {
    const normalizedOrder = normalizeWidgetOrder(widgetOrder, availableWidgetIds)
    const widgetsById = new Map(widgetDefinitions.map((widget) => [widget.id, widget]))
    return normalizedOrder.map((widgetId) => widgetsById.get(widgetId)).filter(Boolean)
  }, [widgetDefinitions, widgetOrder, availableWidgetIds])

  const handleWidgetReorder = ({ activeId, overId }) => {
    setWidgetOrder((currentOrder) => {
      const normalizedOrder = normalizeWidgetOrder(currentOrder, availableWidgetIds)
      const nextOrder = reorderWidgetOrder(normalizedOrder, activeId, overId)

      if (isSameOrder(normalizedOrder, nextOrder)) {
        return normalizedOrder
      }

      writeWidgetOrder(WIDGET_ORDER_STORAGE_KEY, nextOrder)
      return nextOrder
    })
  }

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

  const totalRecords = Object.values(data?.totals ?? {}).reduce(
    (sum, count) => sum + Number(count || 0),
    0,
  )
  const hasData = totalRecords > 0

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

      <KpiCards cards={data?.kpiCards ?? []} />

      <WidgetGrid
        widgets={orderedWidgets}
        disabled={isFetching}
        onReorder={handleWidgetReorder}
      />
    </PageContainer>
  )
}

export default DashboardPage
