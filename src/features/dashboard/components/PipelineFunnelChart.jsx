import EmptyState from '../../../components/ui/EmptyState.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`
}

function PipelineFunnelChart({ data = [] }) {
  const chartData = data.map((entry) => ({
    ...entry,
    label: entry.stage,
  }))

  return (
    <WidgetContainer
      as="article"
      className="dashboard-panel"
      eyebrow="Pipeline Funnel"
      title="Pipeline progression funnel"
      meta="Conversion across active and won stages"
    >
      {data.length ? (
        <div className="dashboard-chart">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 6, right: 10, left: 6, bottom: 6 }}
            >
              <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" horizontal={false} />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                tick={{ fill: '#92a8bd', fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={96}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#dbe7f5', fontSize: 12 }}
              />
              <Tooltip
                cursor={false}
                contentStyle={{
                  background: 'rgba(7, 18, 32, 0.95)',
                  border: '1px solid rgba(148, 163, 184, 0.24)',
                  borderRadius: '0.7rem',
                  color: '#e8f2ff',
                }}
                formatter={(value, name, item) => {
                  if (name === 'funnelDeals') {
                    return [value, 'Deals in funnel']
                  }

                  if (name === 'actualDeals') {
                    return [value, 'Deals in stage']
                  }

                  return [formatPercent(item?.payload?.conversionFromTop), 'Conversion from top']
                }}
                labelFormatter={(label) => `Stage: ${label}`}
              />
              <Bar
                dataKey="funnelDeals"
                name="funnelDeals"
                fill="#2dd4bf"
                radius={[0, 8, 8, 0]}
                animationDuration={480}
                activeBar={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState
          contained={false}
          eyebrow="Pipeline Funnel"
          title="No funnel data available"
          description="Funnel progression appears when deals are distributed across stages."
        />
      )}
    </WidgetContainer>
  )
}

export default PipelineFunnelChart
