export function paginateRows(rows = [], config = {}) {
  const {
    currentPage = 1,
    pageSize = 10,
  } = config

  const safePageSize = Math.max(1, Number.parseInt(String(pageSize), 10) || 10)
  const totalPages = Math.max(1, Math.ceil(rows.length / safePageSize))
  const effectiveCurrentPage = Math.min(
    totalPages,
    Math.max(1, Number.parseInt(String(currentPage), 10) || 1),
  )
  const startIndex = (effectiveCurrentPage - 1) * safePageSize
  const pageRows = rows.slice(startIndex, startIndex + safePageSize)
  const startRow = rows.length ? startIndex + 1 : 0
  const endRow = Math.min(effectiveCurrentPage * safePageSize, rows.length)

  return {
    rows: pageRows,
    totalRows: rows.length,
    totalPages,
    currentPage: effectiveCurrentPage,
    startRow,
    endRow,
  }
}

export default paginateRows
