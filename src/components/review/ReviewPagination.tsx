interface ReviewPaginationProps {
  page: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const PAGE_WINDOW_SIZE = 5;

/** 20개씩 구분된 감상평 목록의 페이지 이동 영역 */
export default function ReviewPagination({
  page,
  totalCount,
  pageSize,
  onPageChange,
}: ReviewPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  if (totalPages <= 1) {
    return null;
  }

  const windowStart = Math.max(1, page - Math.floor(PAGE_WINDOW_SIZE / 2));
  const windowEnd = Math.min(totalPages, windowStart + PAGE_WINDOW_SIZE - 1);
  const pageNumbers = Array.from(
    { length: windowEnd - windowStart + 1 },
    (_, index) => windowStart + index,
  );

  function handlePrevious() {
    if (page > 1) {
      onPageChange(page - 1);
    }
  }

  function handleNext() {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 py-4" aria-label="페이징">
      <button
        type="button"
        onClick={handlePrevious}
        disabled={page === 1}
        className="rounded-lg px-3 py-1.5 text-sm text-zinc-600 disabled:opacity-40"
      >
        이전
      </button>
      {pageNumbers.map((pageNumber) => (
        <PageNumberButton
          key={pageNumber}
          pageNumber={pageNumber}
          isActive={pageNumber === page}
          onPageChange={onPageChange}
        />
      ))}
      <button
        type="button"
        onClick={handleNext}
        disabled={page === totalPages}
        className="rounded-lg px-3 py-1.5 text-sm text-zinc-600 disabled:opacity-40"
      >
        다음
      </button>
    </nav>
  );
}

interface PageNumberButtonProps {
  pageNumber: number;
  isActive: boolean;
  onPageChange: (page: number) => void;
}

function PageNumberButton({ pageNumber, isActive, onPageChange }: PageNumberButtonProps) {
  function handleClick() {
    onPageChange(pageNumber);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
      className={
        isActive
          ? "rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white"
          : "rounded-lg px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100"
      }
    >
      {pageNumber}
    </button>
  );
}
