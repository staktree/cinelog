/**
 * 감상평 목록 페이징
 * - SDD/감상평조회기능명세.md 4번 규칙 (20개씩 페이지 구분)
 */

interface ReviewPaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function ReviewPagination({ page, pageSize, totalCount, onPageChange }: ReviewPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const pageNumbers = Array.from({ length: totalPages }, (_unused, index) => index + 1);

  function renderPageButton(pageNumber: number) {
    function handleClick() {
      onPageChange(pageNumber);
    }

    const isCurrentPage = pageNumber === page;

    return (
      <button
        key={pageNumber}
        type="button"
        onClick={handleClick}
        aria-current={isCurrentPage}
        className={`h-8 w-8 rounded-md text-sm ${
          isCurrentPage ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        {pageNumber}
      </button>
    );
  }

  return (
    <nav className="flex items-center justify-center gap-1 py-4" aria-label="페이징">
      {pageNumbers.map(renderPageButton)}
    </nav>
  );
}
