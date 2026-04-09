import AccountsTable from './AccountsTable.jsx'
import ActivityFeed from './ActivityFeed.jsx'
import PipelineStages from './PipelineStages.jsx'
import StatsGrid from './StatsGrid.jsx'

function DashboardContent({
  accountRows,
  activityFeed,
  performanceCards,
  pipelineStages,
}) {
  return (
    <>
      <StatsGrid cards={performanceCards} />

      <section className="content-grid">
        <PipelineStages stages={pipelineStages} />
        <ActivityFeed items={activityFeed} />
      </section>

      <AccountsTable rows={accountRows} />
    </>
  )
}

export default DashboardContent
