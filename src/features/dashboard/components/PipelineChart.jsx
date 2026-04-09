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

function formatCompactCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value || 0))
}

function PipelineChart({ data = [] }) {
  return (
    <WidgetContainer
      as="article"
      className="dashboard-panel dashboard-panel--pipeline"
      eyebrow="Pipeline"
      title="Stage distribution"
      meta="Deals and value by stage"
    >
      {data.length ? (
        <div className="dashboard-chart">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} barGap={8}>
              <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9cb0c6', fontSize: 12 }}
                interval={0}
                angle={-18}
                textAnchor="end"
                height={52}
              />
              <YAxis
                yAxisId="count"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9cb0c6', fontSize: 12 }}
              />
              <YAxis
                yAxisId="value"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#7da3bc', fontSize: 12 }}
                tickFormatter={formatCompactCurrency}
              />
              <Tooltip
                cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
                contentStyle={{
                  background: 'rgba(7, 18, 32, 0.95)',
                  border: '1px solid rgba(148, 163, 184, 0.24)',
                  borderRadius: '0.7rem',
                  color: '#e8f2ff',
                }}
                formatter={(value, name) => {
                  if (name === 'pipelineValue') {
                    return [formatCompactCurrency(value), 'Pipeline value']
                  }
                  return [value, 'Deals']
                }}
              />
              <Bar
                yAxisId="count"
                dataKey="dealCount"
                fill="#2dd4bf"
                radius={[8, 8, 0, 0]}
                name="Deals"
              />
              <Bar
                yAxisId="value"
                dataKey="pipelineValue"
                fill="#38bdf8"
                radius={[8, 8, 0, 0]}
                name="Pipeline value"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState
          contained={false}
          eyebrow="Pipeline"
          title="No pipeline metrics available"
          description="Pipeline stages will appear here once deals are available."
        />
      )}
    </WidgetContainer>
  )
}

export default PipelineChart
