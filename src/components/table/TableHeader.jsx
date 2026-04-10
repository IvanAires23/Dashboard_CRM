import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

function TableHeader({
  column,
  sortConfig,
  onSortChange,
}) {
  const isSortable = column.sortable !== false
  const isSortedColumn = isSortable && sortConfig.columnId === column.id
  const direction = isSortedColumn ? sortConfig.direction : null

  const nextDirection = isSortedColumn && direction === 'asc' ? 'desc' : 'asc'
  const sortIcon = !isSortable
    ? null
    : direction === 'asc'
      ? <ArrowUp size={14} strokeWidth={2.2} />
      : direction === 'desc'
        ? <ArrowDown size={14} strokeWidth={2.2} />
        : <ArrowUpDown size={14} strokeWidth={2.2} />
  const ariaSort = !isSortable
    ? undefined
    : direction === 'asc'
      ? 'ascending'
      : direction === 'desc'
        ? 'descending'
        : 'none'
  const sortLabel = !isSortable
    ? undefined
    : direction
      ? `${column.header}, sorted ${direction}. Activate to sort ${nextDirection}.`
      : `Sort by ${column.header} ascending`

  return (
    <th
      className={isSortable ? 'table-header-cell table-header-cell--sortable' : 'table-header-cell'}
      scope="col"
      aria-sort={ariaSort}
    >
      {isSortable ? (
        <button
          type="button"
          className="table-sort-button"
          onClick={() => onSortChange(column.id, nextDirection)}
          aria-label={sortLabel}
        >
          <span>{column.header}</span>
          {sortIcon}
        </button>
      ) : (
        <span>{column.header}</span>
      )}
    </th>
  )
}

export default TableHeader
