import { accountRows } from '../features/accounts/accountData.js'
import { activityFeed, performanceCards, pipelineStages } from '../features/dashboard/dashboardData.js'

function cloneRows(rows) {
  return rows.map((row) => ({ ...row }))
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function getDashboardOverview() {
  await delay(300)

  return {
    performanceCards: cloneRows(performanceCards),
    pipelineStages: cloneRows(pipelineStages),
    activityFeed: cloneRows(activityFeed),
    accountRows: cloneRows(accountRows),
  }
}

export default {
  getDashboardOverview,
}
