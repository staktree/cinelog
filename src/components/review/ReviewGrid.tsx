import type { Review } from "@/types/review";

import StarRatingDisplay from "./StarRatingDisplay";

interface ReviewGridProps {
  reviews: Review[];
  onSelect: (id: string) => void;
}

/** 감상평 리스트를 제목/평점/작성일자 컬럼으로 표시한다 (와이어프레임: 화면 구성_감상평 조회.png) */
export default function ReviewGrid({ reviews, onSelect }: ReviewGridProps) {
  if (reviews.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-zinc-500">
        조건에 맞는 감상평이 없습니다.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead className="bg-zinc-50 text-left text-zinc-500">
          <tr>
            <th className="px-4 py-3 font-medium">영화 제목</th>
            <th className="px-4 py-3 font-medium">평점</th>
            <th className="px-4 py-3 font-medium">작성일</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {reviews.map((review) => (
            <ReviewGridRow key={review.id} review={review} onSelect={onSelect} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ReviewGridRowProps {
  review: Review;
  onSelect: (id: string) => void;
}

function ReviewGridRow({ review, onSelect }: ReviewGridRowProps) {
  function handleClick() {
    onSelect(review.id);
  }

  return (
    <tr onClick={handleClick} className="cursor-pointer transition hover:bg-zinc-50">
      <td className="px-4 py-3 font-medium text-zinc-900">{review.title}</td>
      <td className="px-4 py-3">
        <StarRatingDisplay value={review.rating} />
      </td>
      <td className="px-4 py-3 text-zinc-500">{review.createdAt}</td>
    </tr>
  );
}
