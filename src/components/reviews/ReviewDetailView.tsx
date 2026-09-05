/**
 * 감상평 표시(읽기 전용) 뷰
 * - SDD/감상평조회기능명세.md 6~7번 규칙
 */

import { ReviewImageFrame } from "@/components/reviews/ReviewImageFrame";
import { StarRatingInput } from "@/components/reviews/StarRatingInput";
import type { Review } from "@/types/review";

interface ReviewDetailViewProps {
  review: Review;
  onEditClick: () => void;
}

export function ReviewDetailView({ review, onEditClick }: ReviewDetailViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-base font-semibold">{review.title}</h3>
        <StarRatingInput value={review.rating} readOnly />
      </div>

      <div className="flex gap-4">
        <ReviewImageFrame value={review.posterImage} readOnly />
        <p className="min-h-[12rem] flex-1 whitespace-pre-wrap rounded-md border border-gray-200 p-3 text-sm">
          {review.content}
        </p>
      </div>

      <p className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700">
        {review.summary}
      </p>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onEditClick}
          className="rounded-md border border-gray-900 px-4 py-2 text-sm font-medium"
        >
          편집하기
        </button>
      </div>
    </div>
  );
}
