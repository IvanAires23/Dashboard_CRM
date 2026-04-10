import {
  BarChart3,
  BriefcaseBusiness,
  CircleDollarSign,
  CirclePercent,
  HandCoins,
  ListChecks,
  Target,
  TriangleAlert,
  Users,
} from 'lucide-react'
import EmptyState from '../../../components/ui/EmptyState.jsx'
import KpiCard from './KpiCard.jsx'

const iconByCardId = {
  'total-leads': Users,
  'total-deals': BriefcaseBusiness,
  'pipeline-value': CircleDollarSign,
  'closed-revenue': HandCoins,
  'conversion-rate': CirclePercent,
  'open-tasks': ListChecks,
  'overdue-tasks': TriangleAlert,
  'forecast-value': Target,
}

function KpiCards({ cards = [], compact = false }) {
  if (!cards.length) {
    return (
      <EmptyState
        eyebrow="KPIs"
        title="No KPI metrics available"
        description="KPI cards will appear once CRM records are available."
      />
    )
  }

  return (
    <section className="dashboard-kpi-grid" aria-label="CRM KPI cards">
      {cards.map((card) => {
        const Icon = iconByCardId[card.id] ?? BarChart3
        return <KpiCard key={card.id} {...card} icon={Icon} compact={compact} />
      })}
    </section>
  )
}

export default KpiCards
