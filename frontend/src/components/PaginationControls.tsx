interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}

const buildVisiblePages = (currentPage: number, totalPages: number): number[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const adjustedStart = Math.max(1, end - 4);

  return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
};

export const PaginationControls = ({
  currentPage,
  totalPages,
  isLoading = false,
  onPageChange
}: PaginationControlsProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = buildVisiblePages(currentPage, totalPages);
  const firstVisiblePage = visiblePages[0];

  return (
    <div className="pagination-controls">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        aria-label="Previous page"
      >
        ←
      </button>

      <div className="page-buttons">
        {firstVisiblePage > 1 ? (
          <>
            <button
              className={`page-number ${currentPage === 1 ? 'active' : ''}`}
              onClick={() => onPageChange(1)}
              disabled={isLoading}
            >
              1
            </button>
            {firstVisiblePage > 2 ? <span className="page-ellipsis">…</span> : null}
          </>
        ) : null}

        {visiblePages.map((pageNumber) => (
          <button
            key={pageNumber}
            className={`page-number ${currentPage === pageNumber ? 'active' : ''}`}
            onClick={() => onPageChange(pageNumber)}
            disabled={isLoading}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        aria-label="Next page"
      >
        →
      </button>
    </div>
  );
};
