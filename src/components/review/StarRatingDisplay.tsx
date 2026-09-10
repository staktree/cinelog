import { REVIEW_RATING_MAX } from "@/types/review";

import StarIcon from "./StarIcon";

interface StarRatingDisplayProps {
  value: number;
}

/** 평점을 별 + 숫자로 읽기 전용 표시한다 (Grid, 감상평 표시 팝업에서 사용) */
export default function StarRatingDisplay({ value }: StarRatingDisplayProps) {
  const fillPercent = (value / REVIEW_RATING_MAX) * 100;
  const stars = Array.from({ length: REVIEW_RATING_MAX }, (_, index) => index);

  return (
    <div className="inline-flex items-center gap-1.5" aria-label={`평점 ${value.toFixed(1)}점`}>
      <div className="relative inline-flex">
        <div className="flex text-zinc-300">
          {stars.map((star) => (
            <StarIcon key={star} className="h-5 w-5" />
          ))}
        </div>
        <div
          className="absolute inset-0 flex overflow-hidden text-amber-400"
          style={{ width: `${fillPercent}%` }}
        >
          {stars.map((star) => (
            <StarIcon key={star} className="h-5 w-5" />
          ))}
        </div>
      </div>
      <span className="text-sm text-zinc-600">{value.toFixed(1)}</span>
    </div>
  );
}
