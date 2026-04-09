import { BarChart3, CircleDollarSign, HandCoins, Target } from 'lucide-react'
import Card from '../../../components/ui/Card.jsx'

const iconByLabel = {
  'Active deals': Target,
  'Pipeline value': CircleDollarSign,
  'Closed revenue': HandCoins,
  'Weighted forecast': BarChart3,
}

function StatCard({ label, value, delta, note }) {
  const Icon = iconByLabel[label] ?? BarChart3

  return (
    <Card as="article" className="metric-card">
      <div className="metric-head">
        <span className="metric-icon">
          <Icon size={18} strokeWidth={2.1} />
        </span>
        <div className="metric-copy">
          <span>{label}</span>
          <p className="metric-value">{value}</p>
        </div>
      </div>
      <div className="metric-footer">
        <strong>{delta}</strong>
        <p className="metric-note">{note}</p>
      </div>
    </Card>
  )
}

export default StatCard
