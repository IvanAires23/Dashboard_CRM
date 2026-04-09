import { useState } from 'react'
import Badge from '../../../components/ui/Badge.jsx'
import Pagination from '../../../components/ui/Pagination.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'

function AccountsTable({ rows }) {
  const rowsPerPage = 4
  const totalPages = Math.ceil(rows.length / rowsPerPage)
  const [currentPage, setCurrentPage] = useState(1)
  const startIndex = (currentPage - 1) * rowsPerPage
  const visibleRows = rows.slice(startIndex, startIndex + rowsPerPage)

  return (
    <WidgetContainer
      className="panel"
      id="accounts"
      eyebrow="Accounts"
      title="High-value portfolio"
      meta="Prioritized for success and expansion"
    >
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Account</th>
              <th>Owner</th>
              <th>Segment</th>
              <th>Health</th>
              <th>MRR</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.owner}</td>
                <td>{row.segment}</td>
                <td>
                  <Badge variant={row.health.toLowerCase()}>
                    {row.health}
                  </Badge>
                </td>
                <td>{row.mrr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <p>
          Showing {startIndex + 1}-{Math.min(startIndex + rowsPerPage, rows.length)} of {rows.length}{' '}
          accounts
        </p>
        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </WidgetContainer>
  )
}

export default AccountsTable
