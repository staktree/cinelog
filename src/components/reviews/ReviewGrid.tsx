/**
 * 감상평 목록 Grid
 * - SDD/감상평조회기능명세.md 1~2, 6, 8번 규칙
 */

import type { KeyboardEvent, MouseEvent } from "react";

import type { ReviewListItem } from "@/types/review";

interface ReviewGridProps {
  items: ReviewListItem[];
  onSelectReview: (reviewId: string) => void;
  onEditReview: (reviewId: string) => void;
  onDeleteReview: (reviewId: string) => void;
}

/** 작성일자(ISO)를 화면 표시용 날짜 문자열로 변환한다 */
function formatDisplayDate(isoDate: string): string {
  return isoDate.slice(0, 10);
}

export function ReviewGrid({ items, onSelectReview, onEditReview, onDeleteReview }: ReviewGridProps) {
  function renderRow(item: ReviewListItem) {
    function handleRowClick() {
      onSelectReview(item.reviewId);
    }

    function handleRowKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelectReview(item.reviewId);
      }
    }

    function handleEditClick(event: MouseEvent) {
      event.stopPropagation();
      onEditReview(item.reviewId);
    }

    function handleDeleteClick(event: MouseEvent) {
      event.stopPropagation();
      onDeleteReview(item.reviewId);
    }

    return (
      <li
        key={item.reviewId}
        onClick={handleRowClick}
        onKeyDown={handleRowKeyDown}
        role="button"
        tabIndex={0}
        className="grid grid-cols-5 items-center gap-4 border-b border-gray-100 px-4 py-3 text-left text-sm hover:bg-gray-50"
      >
        <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border border-gray-200">
          {item.posterImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.posterImage} alt={item.title} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-gray-400">-</span>
          )}
        </span>
        <span className="truncate">{item.title}</span>
        <span>{item.rating.toFixed(1)}</span>
        <span>{formatDisplayDate(item.createdAt)}</span>
        <span className="flex gap-2">
          <button
            type="button"
            onClick={handleEditClick}
            aria-label="수정"
            className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100"
          >
            ✏️ 수정
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            aria-label="삭제"
            className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100"
          >
            🗑️ 삭제
          </button>
        </span>
      </li>
    );
  }

  if (items.length === 0) {
    return <p className="px-4 py-8 text-center text-sm text-gray-500">작성된 감상평이 없습니다.</p>;
  }

  return (
    <div className="border border-gray-200">
      <div className="grid grid-cols-5 gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold">
        <span>썸네일</span>
        <span>영화 제목</span>
        <span>영화 평점</span>
        <span>작성일</span>
        <span>수정/삭제</span>
      </div>
      <ul>{items.map(renderRow)}</ul>
    </div>
  );
}
