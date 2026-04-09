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
      <ul className="activity-list">
        {items.map((item) => (
          <li key={item.title}>
            <strong>{item.title}</strong>
            <span>{item.meta}</span>
          </li>
        ))}
      </ul>
    </WidgetContainer>
  )
}

export default ActivityFeed
