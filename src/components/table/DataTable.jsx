import { useEffect, useId, useMemo } from 'react'
import TableHeader from './TableHeader.jsx'
import Pagination from './Pagination.jsx'
import { paginateRows } from '../../lib/table/paginateRows.js'
import { sortRows } from '../../lib/table/sortRows.js'
import './table.css'

function getCellContent(column, row) {
  if (typeof column.cell === 'function') {
    return column.cell(row)
  }

  if (typeof column.accessor === 'function') {
    return column.accessor(row)
  }

  return row?.[column.id]
}

function DataTable({
  columns = [],
  rows = [],
  rowKey,
  sortConfig = { columnId: '', direction: 'asc' },
  onSortChange = () => {},
  pagination = null,
  emptyMessage = 'No records found.',
  emptyState = null,
  entityLabel = 'records',
  tableLabel,
  tableCaption,
}) {
  const tableId = useId()
  const sortedRows = useMemo(
    () => sortRows(rows, sortConfig, columns),
    [rows, sortConfig, columns],
  )

  const pageData = useMemo(() => {
    if (!pagination) {
      return {
        rows: sortedRows,
        totalRows: sortedRows.length,
        totalPages: 1,
        currentPage: 1,
        startRow: sortedRows.length ? 1 : 0,
        endRow: sortedRows.length,
      }
    }

    return paginateRows(sortedRows, {
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize,
    })
  }, [sortedRows, pagination])

  useEffect(() => {
    if (!pagination) {
      return
    }

    if (pageData.currentPage !== pagination.currentPage) {
      pagination.onPageChange(pageData.currentPage)
    }
  }, [pagination, pageData.currentPage])

  if (pageData.totalRows === 0 && emptyState) {
    return <div className="data-table__empty">{emptyState}</div>
  }

  const resolvedTableLabel = tableLabel || `${entityLabel} table`
  const resolvedTableCaption = tableCaption || `Sortable table of ${entityLabel}`

  return (
    <>
      <div className="table-wrap data-table-wrap">
        <table id={tableId} aria-label={resolvedTableLabel}>
          <caption className="sr-only">{resolvedTableCaption}</caption>
          <thead>
            <tr>
              {columns.map((column) => (
                <TableHeader
                  key={column.id}
                  column={column}
                  sortConfig={sortConfig}
                  onSortChange={onSortChange}
                />
              ))}
            </tr>
          </thead>

          <tbody>
            {pageData.rows.length ? (
              pageData.rows.map((row, rowIndex) => (
                <tr key={rowKey(row, rowIndex)}>
                  {columns.map((column, columnIndex) => {
                    const CellTag = column.rowHeader || columnIndex === 0 ? 'th' : 'td'

                    return (
                      <CellTag
                        key={column.id}
                        className={column.cellClassName}
                        scope={CellTag === 'th' ? 'row' : undefined}
                      >
                        {getCellContent(column, row)}
                      </CellTag>
                    )
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>{emptyMessage}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <p aria-live="polite">
          Showing {pageData.startRow}-{pageData.endRow} of {pageData.totalRows} {entityLabel}
        </p>

        {pagination ? (
          <Pagination
            tableId={tableId}
            currentPage={pageData.currentPage}
            onPageChange={pagination.onPageChange}
            totalPages={pageData.totalPages}
          />
        ) : null}
      </div>
    </>
  )
}

export default DataTable
