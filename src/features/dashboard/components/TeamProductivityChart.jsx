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

function TeamProductivityChart({ data = [] }) {
  return (
    <WidgetContainer
      as="article"
      className="dashboard-panel"
      eyebrow="Team"
      title="Team productivity"
      meta="Completed tasks, active work, and won deals by owner"
    >
      {data.length ? (
        <div className="dashboard-chart">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ left: 12, right: 6 }}>
              <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" horizontal={false} />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9cb0c6', fontSize: 12 }}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="owner"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9cb0c6', fontSize: 12 }}
                width={94}
              />
              <Tooltip
                cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
                contentStyle={{
                  background: 'rgba(7, 18, 32, 0.95)',
                  border: '1px solid rgba(148, 163, 184, 0.24)',
                  borderRadius: '0.7rem',
                  color: '#e8f2ff',
                }}
              />
              <Bar
                dataKey="completedTasks"
                name="Completed tasks"
                fill="#2dd4bf"
                radius={[0, 6, 6, 0]}
              />
              <Bar
                dataKey="openTasks"
                name="Open tasks"
                fill="#f59e0b"
                radius={[0, 6, 6, 0]}
              />
              <Bar
                dataKey="wonDeals"
                name="Won deals"
                fill="#38bdf8"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState
          contained={false}
          eyebrow="Team"
          title="No team productivity metrics"
          description="Team performance appears once tasks and deal ownership data are available."
        />
      )}
    </WidgetContainer>
  )
}

export default TeamProductivityChart
