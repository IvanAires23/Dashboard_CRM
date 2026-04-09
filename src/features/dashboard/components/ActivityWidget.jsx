import EmptyState from '../../../components/ui/EmptyState.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'

function ActivityWidget({ items = [] }) {
  return (
    <WidgetContainer
      as="article"
      className="dashboard-panel dashboard-panel--activity"
      eyebrow="Activity"
      title="Latest CRM updates"
      meta="Cross-entity operational feed"
    >
      {items.length ? (
        <ul className="dashboard-activity-list">
          {items.map((item) => (
            <li key={item.id} className="dashboard-activity-list__item">
              <strong>{item.title}</strong>
              <span>{item.meta}</span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          contained={false}
          eyebrow="Activity"
          title="No activity yet"
          description="Lead, deal, account, contact, and task events will appear here."
        />
      )}
    </WidgetContainer>
  )
}

export default ActivityWidget
