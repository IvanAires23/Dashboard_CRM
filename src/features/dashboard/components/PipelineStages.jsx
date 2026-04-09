import EmptyState from '../../../components/ui/EmptyState.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'

function PipelineStages({ stages }) {
  return (
    <WidgetContainer
      as="article"
      className="panel"
      id="pipeline"
      eyebrow="Pipeline"
      title="Pipeline overview"
      meta="Current stage distribution"
    >
      {stages.length ? (
        <div className="stage-grid">
          {stages.map((stage) => (
            <div className="stage-card" key={stage.name}>
              <span>{stage.name}</span>
              <strong>{stage.deals} deals</strong>
              <p>{stage.value}</p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          contained={false}
          eyebrow="Pipeline"
          title="No stages available"
          description="Pipeline distribution will appear here once deals are loaded."
        />
      )}
    </WidgetContainer>
  )
}

export default PipelineStages
