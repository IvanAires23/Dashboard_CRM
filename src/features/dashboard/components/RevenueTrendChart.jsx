import EmptyState from '../../../components/ui/EmptyState.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
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

function RevenueTrendChart({ data = [] }) {
  return (
    <WidgetContainer
      as="article"
      className="dashboard-panel"
      eyebrow="Revenue"
      title="Revenue over time"
      meta="Won revenue and closed deals by month"
    >
      {data.length ? (
        <div className="dashboard-chart">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="dashboard-revenue-trend-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9cb0c6', fontSize: 12 }}
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9cb0c6', fontSize: 12 }}
                tickFormatter={formatCompactCurrency}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#7da3bc', fontSize: 12 }}
                allowDecimals={false}
              />

              <Tooltip
                cursor={{ stroke: 'rgba(45, 212, 191, 0.3)', strokeDasharray: '4 4' }}
                contentStyle={{
                  background: 'rgba(7, 18, 32, 0.95)',
                  border: '1px solid rgba(148, 163, 184, 0.24)',
                  borderRadius: '0.7rem',
                  color: '#e8f2ff',
                }}
                formatter={(value, name) => {
                  if (name === 'revenue') {
                    return [formatCompactCurrency(value), 'Revenue']
                  }
                  return [value, 'Won deals']
                }}
              />

              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#14b8a6"
                fill="url(#dashboard-revenue-trend-fill)"
                strokeWidth={2.2}
                name="Revenue"
              />

              <Line
                yAxisId="right"
                type="monotone"
                dataKey="wonDeals"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={{ r: 3, fill: '#38bdf8' }}
                activeDot={{ r: 5 }}
                name="Won deals"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState
          contained={false}
          eyebrow="Revenue"
          title="No revenue trend available"
          description="Revenue trend appears once won deals are tracked over time."
        />
      )}
    </WidgetContainer>
  )
}

export default RevenueTrendChart
