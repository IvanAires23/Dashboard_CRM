import { useMemo, useState } from 'react'
import Card from '../../../components/ui/Card.jsx'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import EmptyState from '../../../components/ui/EmptyState.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import Skeleton from '../../../components/ui/Skeleton.jsx'
import { useDashboardQuery } from '../api/useDashboardQuery.js'
import ActivityWidget from '../components/ActivityWidget.jsx'
import AccountsTable from '../components/AccountsTable.jsx'
import ForecastChart from '../components/ForecastChart.jsx'
import KpiCards from '../components/KpiCards.jsx'
import KpiCardSkeleton from '../components/KpiCardSkeleton.jsx'
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
const DASHBOARD_DENSITY_STORAGE_KEY = 'dashboard-density-mode-v1'
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
const CORE_KPI_IDS = new Set([
  'total-leads',
  'total-deals',
  'pipeline-value',
  'closed-revenue',
])
const CORE_WIDGET_IDS = new Set([
  'revenue-trend',
  'pipeline-funnel',
  'stage-distribution',
  'activity-widget',
])

function readDashboardDensityMode() {
  try {
    if (typeof window === 'undefined') {
      return 'compact'
    }

    const value = window.localStorage.getItem(DASHBOARD_DENSITY_STORAGE_KEY)
    return value === 'full' ? 'full' : 'compact'
  } catch {
    return 'compact'
  }
}

function writeDashboardDensityMode(mode) {
  try {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(DASHBOARD_DENSITY_STORAGE_KEY, mode)
  } catch {
    // no-op
  }
}

function isSameOrder(leftOrder = [], rightOrder = []) {
  if (leftOrder.length !== rightOrder.length) {
    return false
  }

  return leftOrder.every((id, index) => id === rightOrder[index])
}

function DashboardWidgetSkeleton() {
  return (
    <Card as="article" className="dashboard-widget-skeleton">
      <div className="dashboard-widget-skeleton__header">
        <Skeleton className="dashboard-widget-skeleton__eyebrow" />
        <Skeleton className="dashboard-widget-skeleton__title" />
        <Skeleton className="dashboard-widget-skeleton__meta" />
      </div>
      <Skeleton className="dashboard-widget-skeleton__chart" />
    </Card>
  )
}

function DashboardPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboardQuery()
  const [dashboardMode, setDashboardMode] = useState(readDashboardDensityMode)
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
  const isCompactMode = dashboardMode !== 'full'

  const visibleWidgets = useMemo(() => {
    if (!isCompactMode) {
      return orderedWidgets
    }

    return orderedWidgets.filter((widget) => CORE_WIDGET_IDS.has(widget.id))
  }, [orderedWidgets, isCompactMode])

  const visibleKpiCards = useMemo(() => {
    const cards = data?.kpiCards ?? []

    if (!isCompactMode) {
      return cards
    }

    return cards.filter((card) => CORE_KPI_IDS.has(card.id))
  }, [data?.kpiCards, isCompactMode])

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

  const handleDashboardModeToggle = () => {
    setDashboardMode((currentMode) => {
      const nextMode = currentMode === 'full' ? 'compact' : 'full'
      writeDashboardDensityMode(nextMode)
      return nextMode
    })
  }

  if (isLoading) {
    return (
      <PageContainer>
        <section className="dashboard-kpi-grid" aria-label="Loading KPI cards">
          {Array.from({ length: 8 }, (_, index) => (
            <KpiCardSkeleton key={`kpi-skeleton-${index}`} />
          ))}
        </section>

        <section className="dashboard-widget-grid" aria-label="Loading dashboard widgets">
          {Array.from({ length: 8 }, (_, index) => (
            <DashboardWidgetSkeleton key={`widget-skeleton-${index}`} />
          ))}
        </section>
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer>
        <ErrorState
          eyebrow="Dashboard"
          title="Unable to load dashboard data"
          error={error}
          description="Please try again in a few seconds."
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
    <PageContainer className="dashboard-page">
      {isFetching ? (
        <LoadingState
          contained={false}
          eyebrow="Dashboard"
          title="Refreshing dashboard"
          description="Updating metrics with the latest available data."
        />
      ) : null}

      <section className="dashboard-toolbar" aria-label="Dashboard view controls">
        <div className="dashboard-toolbar__copy">
          <h2>Dashboard overview</h2>
        </div>

        <button
          type="button"
          className="dashboard-toolbar__toggle"
          onClick={handleDashboardModeToggle}
        >
          {isCompactMode ? 'Full view' : 'Compact view'}
        </button>
      </section>

      <KpiCards cards={visibleKpiCards} compact={isCompactMode} />

      <WidgetGrid
        widgets={visibleWidgets}
        disabled={isFetching}
        onReorder={handleWidgetReorder}
        showHandles={!isCompactMode}
      />
    </PageContainer>
  )
}

export default DashboardPage
