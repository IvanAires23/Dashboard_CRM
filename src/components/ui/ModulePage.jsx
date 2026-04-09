import Card from './Card.jsx'
import PageContainer from './PageContainer.jsx'
import WidgetContainer from './WidgetContainer.jsx'

function ModulePage({
  eyebrow = 'Module',
  description,
  summaryCards = [],
  nextSteps = [],
}) {
  return (
    <PageContainer className="module-page">
      <Card className="module-header">
        <div className="module-header__copy">
          <p className="eyebrow">{eyebrow}</p>
          <p>{description}</p>
        </div>
      </Card>

      {summaryCards.length ? (
        <section className="module-stats">
          {summaryCards.map((card) => (
            <Card className="module-stat-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <p>{card.note}</p>
            </Card>
          ))}
        </section>
      ) : null}

      {nextSteps.length ? (
        <WidgetContainer eyebrow="Workflow" title="What comes next">
          <ul className="module-checklist">
            {nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </WidgetContainer>
      ) : null}
    </PageContainer>
  )
}

export default ModulePage
