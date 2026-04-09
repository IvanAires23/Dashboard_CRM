import { accountRows } from '../../accounts/accountData.js'
import DashboardContent from '../components/DashboardContent.jsx'
import { activityFeed, performanceCards, pipelineStages } from '../dashboardData.js'
import '../DashboardPage.css'

function DashboardPage() {
  return (
    <DashboardContent
      accountRows={accountRows}
      activityFeed={activityFeed}
      performanceCards={performanceCards}
      pipelineStages={pipelineStages}
    />
  )
}

export default DashboardPage
