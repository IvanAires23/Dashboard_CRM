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

function ForecastChart({ data = [] }) {
  return (
    <WidgetContainer
      as="article"
      className="dashboard-panel"
      eyebrow="Forecast"
      title="Forecast over time"
      meta="Pipeline value vs weighted forecast by expected close month"
    >
      {data.length ? (
        <div className="dashboard-chart">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="dashboard-forecast-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.38} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
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
                cursor={{ stroke: 'rgba(56, 189, 248, 0.35)', strokeDasharray: '4 4' }}
                contentStyle={{
                  background: 'rgba(7, 18, 32, 0.95)',
                  border: '1px solid rgba(148, 163, 184, 0.24)',
                  borderRadius: '0.7rem',
                  color: '#e8f2ff',
                }}
                formatter={(value, name) => {
                  if (name === 'openDeals') {
                    return [value, 'Open deals']
                  }

                  if (name === 'pipelineValue') {
                    return [formatCompactCurrency(value), 'Pipeline value']
                  }

                  return [formatCompactCurrency(value), 'Forecast value']
                }}
              />

              <Area
                yAxisId="left"
                type="monotone"
                dataKey="pipelineValue"
                stroke="#38bdf8"
                fill="url(#dashboard-forecast-fill)"
                strokeWidth={2.1}
                name="Pipeline value"
              />

              <Line
                yAxisId="left"
                type="monotone"
                dataKey="forecastValue"
                stroke="#2dd4bf"
                strokeWidth={2}
                dot={{ r: 3, fill: '#2dd4bf' }}
                activeDot={{ r: 5 }}
                name="Forecast value"
              />

              <Line
                yAxisId="right"
                type="monotone"
                dataKey="openDeals"
                stroke="#f59e0b"
                strokeWidth={1.8}
                dot={{ r: 2.5, fill: '#f59e0b' }}
                activeDot={{ r: 4 }}
                name="Open deals"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState
          contained={false}
          eyebrow="Forecast"
          title="No forecast trend available"
          description="Forecast trend appears when open deals have value and expected close dates."
        />
      )}
    </WidgetContainer>
  )
}

export default ForecastChart
