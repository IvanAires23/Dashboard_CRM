import { useId, useState } from 'react'
import EmptyState from '../../../components/ui/EmptyState.jsx'
import Pagination from '../../../components/ui/Pagination.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'

function AccountsTable({ rows }) {
  const tableId = useId()
  const rowsPerPage = 4
  const totalPages = Math.ceil(rows.length / rowsPerPage)
  const [currentPage, setCurrentPage] = useState(1)
  const startIndex = (currentPage - 1) * rowsPerPage
  const visibleRows = rows.slice(startIndex, startIndex + rowsPerPage)

  return (
    <WidgetContainer
      className="dashboard-panel"
      id="accounts"
      eyebrow="Accounts"
      title="High-value portfolio"
      meta="Ranked by open pipeline value"
    >
      {rows.length ? (
        <>
          <div className="table-wrap">
            <table id={tableId} aria-label="Accounts portfolio table">
              <caption className="sr-only">High-value accounts portfolio</caption>
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Industry</th>
                  <th>Open deals</th>
                  <th>Pipeline value</th>
                  <th>Contacts</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={row.id || row.name}>
                    <th scope="row">{row.name}</th>
                    <td>{row.industry}</td>
                    <td>{row.openDealCount}</td>
                    <td>{row.pipelineValueLabel}</td>
                    <td>{row.contactCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <p>
              Showing {startIndex + 1}-{Math.min(startIndex + rowsPerPage, rows.length)} of{' '}
              {rows.length} accounts
            </p>
            <Pagination
              tableId={tableId}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        </>
      ) : (
        <EmptyState
          contained={false}
          eyebrow="Accounts"
          title="No portfolio accounts"
          description="Account records will appear here when data is available."
        />
      )}
    </WidgetContainer>
  )
}

export default AccountsTable
