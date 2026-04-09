import EmptyState from '../../../components/ui/EmptyState.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'

function ActivityFeed({ items }) {
  return (
    <WidgetContainer
      as="article"
      className="panel activity-panel"
      id="activity"
      eyebrow="Recent Activity"
      title="Team signals"
    >
      {items.length ? (
        <ul className="activity-list">
          {items.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.meta}</span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          contained={false}
          eyebrow="Activity"
          title="No recent signals"
          description="Team activity will appear here as updates happen."
        />
      )}
    </WidgetContainer>
  )
}

export default ActivityFeed
