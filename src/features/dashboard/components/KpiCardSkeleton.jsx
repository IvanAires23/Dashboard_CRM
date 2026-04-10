import Card from '../../../components/ui/Card.jsx'
import Skeleton from '../../../components/ui/Skeleton.jsx'

function KpiCardSkeleton() {
  return (
    <Card as="article" className="dashboard-kpi-card dashboard-kpi-card--skeleton">
      <div className="dashboard-kpi-card__header">
        <Skeleton className="dashboard-kpi-card__icon dashboard-kpi-card__icon--skeleton" />
        <div className="dashboard-kpi-card__copy">
          <Skeleton className="dashboard-kpi-card__line dashboard-kpi-card__line--label" />
          <Skeleton className="dashboard-kpi-card__line dashboard-kpi-card__line--value" />
        </div>
      </div>
      <div className="dashboard-kpi-card__footer">
        <Skeleton className="dashboard-kpi-card__line dashboard-kpi-card__line--meta" />
        <Skeleton className="dashboard-kpi-card__line dashboard-kpi-card__line--note" />
      </div>
    </Card>
  )
}

export default KpiCardSkeleton
