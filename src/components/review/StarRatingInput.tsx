import { REVIEW_RATING_MAX } from "@/types/review";

import StarIcon from "./StarIcon";

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
}

/** 별 반개(0.5점) 단위로 평점을 입력받는다 (와이어프레임: 별점 - 별로 표시 및 별 반개당 0.5점) */
export default function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  const stars = Array.from({ length: REVIEW_RATING_MAX }, (_, index) => index + 1);

  function getFillPercent(starIndex: number): number {
    const diff = value - (starIndex - 1);
    if (diff <= 0) return 0;
    if (diff >= 1) return 100;
    return diff * 100;
  }

  function handleSelectHalf(starIndex: number) {
    onChange(starIndex - 0.5);
  }

  function handleSelectFull(starIndex: number) {
    onChange(starIndex);
  }

  return (
    <div className="inline-flex items-center gap-2">
      <div className="inline-flex">
        {stars.map((starIndex) => (
          <div key={starIndex} className="relative h-8 w-8">
            <StarIcon className="absolute inset-0 h-8 w-8 text-zinc-300" />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${getFillPercent(starIndex)}%` }}
            >
              <StarIcon className="h-8 w-8 text-amber-400" />
            </div>
            <button
              type="button"
              aria-label={`${starIndex - 0.5}점`}
              className="absolute inset-y-0 left-0 w-1/2"
              onClick={() => handleSelectHalf(starIndex)}
            />
            <button
              type="button"
              aria-label={`${starIndex}점`}
              className="absolute inset-y-0 right-0 w-1/2"
              onClick={() => handleSelectFull(starIndex)}
            />
          </div>
        ))}
      </div>
      <span className="text-sm font-medium text-zinc-700">{value.toFixed(1)}점</span>
    </div>
  );
}
