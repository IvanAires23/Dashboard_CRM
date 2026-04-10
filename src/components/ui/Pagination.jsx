import clsx from 'clsx'
import './ui.css'

function Pagination({ currentPage, onPageChange, totalPages, tableId }) {
  if (totalPages <= 1) {
    return null
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination__button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
        aria-label="Go to previous page"
        aria-controls={tableId}
      >
        Prev
      </button>

      <div className="pagination__pages">
        {pages.map((page) => (
          <button
            key={page}
            className={clsx('pagination__button', {
              'pagination__button--active': page === currentPage,
            })}
            onClick={() => onPageChange(page)}
            type="button"
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-controls={tableId}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="pagination__button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
        aria-label="Go to next page"
        aria-controls={tableId}
      >
        Next
      </button>
    </nav>
  )
}

export default Pagination
