import EmptyState from '../../../components/ui/EmptyState.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const SLICE_COLORS = ['#2dd4bf', '#38bdf8', '#818cf8', '#f59e0b', '#22c55e', '#fb7185']

function formatCompactCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value || 0))
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`
}

function StageDistributionChart({ data = [] }) {
  const nonEmptyData = data.filter((stage) => stage.deals > 0)

  return (
    <WidgetContainer
      as="article"
      className="dashboard-panel"
      eyebrow="Deal Mix"
      title="Deal distribution by stage"
      meta="Current stage composition across pipeline"
    >
      {nonEmptyData.length ? (
        <div className="dashboard-chart">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={nonEmptyData}
                dataKey="deals"
                nameKey="stage"
                cx="50%"
                cy="50%"
                outerRadius={86}
                innerRadius={44}
                paddingAngle={2}
              >
                {nonEmptyData.map((entry, index) => (
                  <Cell
                    key={entry.stageId}
                    fill={SLICE_COLORS[index % SLICE_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  background: 'rgba(7, 18, 32, 0.95)',
                  border: '1px solid rgba(148, 163, 184, 0.24)',
                  borderRadius: '0.7rem',
                  color: '#e8f2ff',
                }}
                formatter={(value, name, entry) => {
                  if (name === 'deals') {
                    return [value, 'Deals']
                  }

                  return [entry?.payload?.stage || '', 'Stage']
                }}
                labelFormatter={(_, payload = []) => {
                  const item = payload[0]?.payload
                  if (!item) {
                    return ''
                  }
                  return `${item.stage} | ${formatPercent(item.share)} | ${formatCompactCurrency(item.value)}`
                }}
              />

              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{ color: '#9cb0c6', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState
          contained={false}
          eyebrow="Deal Mix"
          title="No stage distribution available"
          description="Stage distribution appears when deals are loaded into the pipeline."
        />
      )}
    </WidgetContainer>
  )
}

export default StageDistributionChart
