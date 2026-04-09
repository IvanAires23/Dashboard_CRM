import EmptyState from '../../../components/ui/EmptyState.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { Funnel, FunnelChart, LabelList, ResponsiveContainer, Tooltip } from 'recharts'

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`
}

function PipelineFunnelChart({ data = [] }) {
  return (
    <WidgetContainer
      as="article"
      className="dashboard-panel"
      eyebrow="Pipeline Funnel"
      title="Pipeline progression funnel"
      meta="Conversion across funnel stages"
    >
      {data.length ? (
        <div className="dashboard-chart">
          <ResponsiveContainer width="100%" height={280}>
            <FunnelChart>
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

                  return [
                    formatPercent(entry?.payload?.conversionFromTop),
                    'Conversion from top',
                  ]
                }}
              />
              <Funnel
                data={data}
                dataKey="deals"
                nameKey="stage"
                isAnimationActive={false}
                fill="#2dd4bf"
                stroke="#38bdf8"
              >
                <LabelList
                  position="right"
                  fill="#cfe7ff"
                  stroke="none"
                  dataKey="stage"
                />
              </Funnel>
            </FunnelChart>
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
