import { BarChart3 } from 'lucide-react'
import { createElement } from 'react'
import Card from '../../../components/ui/Card.jsx'

function KpiCard({ label, value, meta, note, icon = BarChart3 }) {
  const IconComponent = icon

  return (
    <Card as="article" className="dashboard-kpi-card">
      <div className="dashboard-kpi-card__header">
        <span className="dashboard-kpi-card__icon">
          {createElement(IconComponent, {
            size: 18,
            strokeWidth: 2.1,
          })}
        </span>
        <div className="dashboard-kpi-card__copy">
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      </div>
      <div className="dashboard-kpi-card__footer">
        <small>{meta}</small>
        <p>{note}</p>
      </div>
    </Card>
  )
}

export default KpiCard
