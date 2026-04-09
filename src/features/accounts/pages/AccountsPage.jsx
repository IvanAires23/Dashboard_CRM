import { useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../../../components/ui/Badge.jsx'
import Card from '../../../components/ui/Card.jsx'
import EmptyState from '../../../components/ui/EmptyState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import Pagination from '../../../components/ui/Pagination.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { accountRows } from '../accountData.js'
import './AccountsPage.css'

function AccountsPage() {
  const rowsPerPage = 6
  const totalPages = Math.ceil(accountRows.length / rowsPerPage)
  const [currentPage, setCurrentPage] = useState(1)
  const startIndex = (currentPage - 1) * rowsPerPage
  const visibleRows = accountRows.slice(startIndex, startIndex + rowsPerPage)
  const strongAccounts = accountRows.filter((row) => row.health === 'Strong').length
  const watchAccounts = accountRows.filter((row) => row.health === 'Watch').length
  const riskAccounts = accountRows.filter((row) => row.health === 'Risk').length

  if (!accountRows.length) {
    return (
      <PageContainer className="accounts-page">
        <EmptyState
          eyebrow="Accounts"
          title="No accounts found"
          description="There are no account records available right now."
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer className="accounts-page">
      <section className="accounts-summary">
        <Card className="accounts-mini-stat">
          <span>Total accounts</span>
          <strong>{accountRows.length}</strong>
          <p>Tracked across segments</p>
        </Card>
        <Card className="accounts-mini-stat">
          <span>Healthy</span>
          <strong>{strongAccounts}</strong>
          <p>Strong expansion potential</p>
        </Card>
        <Card className="accounts-mini-stat">
          <span>Needs attention</span>
          <strong>{watchAccounts + riskAccounts}</strong>
          <p>Watch and risk combined</p>
        </Card>
      </section>

      <WidgetContainer
        className="accounts-panel"
        eyebrow="Portfolio"
        title="Account directory"
        meta="Prioritized by owner, health and renewal timing"
      >
        <div className="accounts-actions">
          <Link className="state-action" to="/accounts/new">
            Create account
          </Link>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Account</th>
                <th>Owner</th>
                <th>Segment</th>
                <th>Health</th>
                <th>MRR</th>
                <th>Renewal</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.owner}</td>
                  <td>{row.segment}</td>
                  <td>
                    <Badge variant={row.health.toLowerCase()}>{row.health}</Badge>
                  </td>
                  <td>{row.mrr}</td>
                  <td>{row.renewal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <p>
            Showing {startIndex + 1}-{Math.min(startIndex + rowsPerPage, accountRows.length)} of{' '}
            {accountRows.length} accounts
          </p>
          <Pagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </WidgetContainer>
    </PageContainer>
  )
}

export default AccountsPage
