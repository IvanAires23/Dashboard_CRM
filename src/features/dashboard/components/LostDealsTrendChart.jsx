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

function LostDealsTrendChart({ data = [] }) {
  return (
    <WidgetContainer
      as="article"
      className="dashboard-panel"
      eyebrow="Risk"
      title="Lost deals trend"
      meta="Lost opportunities and value leakage over time"
    >
      {data.length ? (
        <div className="dashboard-chart">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="dashboard-lost-deals-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.42} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
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
                allowDecimals={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#7da3bc', fontSize: 12 }}
                tickFormatter={formatCompactCurrency}
              />

              <Tooltip
                cursor={{ stroke: 'rgba(251, 113, 133, 0.35)', strokeDasharray: '4 4' }}
                contentStyle={{
                  background: 'rgba(7, 18, 32, 0.95)',
                  border: '1px solid rgba(148, 163, 184, 0.24)',
                  borderRadius: '0.7rem',
                  color: '#e8f2ff',
                }}
                formatter={(value, name) => {
                  if (name === 'lostDeals') {
                    return [value, 'Lost deals']
                  }
                  return [formatCompactCurrency(value), 'Lost value']
                }}
              />

              <Line
                yAxisId="left"
                type="monotone"
                dataKey="lostDeals"
                stroke="#fb7185"
                strokeWidth={2}
                dot={{ r: 3, fill: '#fb7185' }}
                activeDot={{ r: 5 }}
                name="Lost deals"
              />

              <Area
                yAxisId="right"
                type="monotone"
                dataKey="lostValue"
                stroke="#f43f5e"
                fill="url(#dashboard-lost-deals-fill)"
                strokeWidth={1.8}
                name="Lost value"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState
          contained={false}
          eyebrow="Risk"
          title="No loss trend available"
          description="Loss trend appears once deals are marked as closed lost."
        />
      )}
    </WidgetContainer>
  )
}

export default LostDealsTrendChart
