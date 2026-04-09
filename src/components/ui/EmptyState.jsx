import Card from './Card.jsx'

function EmptyState({ description, title }) {
  return (
    <Card className="empty-state">
      <div className="empty-state__content">
        <p className="eyebrow">Module</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </Card>
  )
}

export default EmptyState
