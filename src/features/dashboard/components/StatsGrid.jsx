import StatCard from './StatCard.jsx'

function StatsGrid({ cards }) {
  return (
    <section className="metrics-grid" aria-label="Performance metrics">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </section>
  )
}

export default StatsGrid
