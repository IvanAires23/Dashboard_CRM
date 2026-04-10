import Skeleton from '../ui/Skeleton.jsx'

function TableSkeleton({
  columns = 5,
  rows = 6,
  showFooter = true,
}) {
  const columnCount = Math.max(1, columns)
  const rowCount = Math.max(1, rows)

  return (
    <div className="table-skeleton" role="status" aria-label="Loading table data">
      <div className="table-wrap data-table-wrap">
        <table>
          <thead>
            <tr>
              {Array.from({ length: columnCount }, (_, index) => (
                <th key={`table-skeleton-head-${index}`}>
                  <Skeleton className="table-skeleton__head" />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: rowCount }, (_, rowIndex) => (
              <tr key={`table-skeleton-row-${rowIndex}`}>
                {Array.from({ length: columnCount }, (_, cellIndex) => (
                  <td key={`table-skeleton-cell-${rowIndex}-${cellIndex}`}>
                    <Skeleton className="table-skeleton__cell" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showFooter ? (
        <div className="table-footer">
          <Skeleton className="table-skeleton__footer-text" />
          <div className="table-skeleton__footer-actions">
            <Skeleton className="table-skeleton__page-button" />
            <Skeleton className="table-skeleton__page-button" />
            <Skeleton className="table-skeleton__page-button" />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default TableSkeleton
