"use client";

/**
 * 별점 표시/입력 공용 컴포넌트
 * - SDD 와이어프레임: 별점 - 별로 표시 및 별 반개당 0.5점으로 계산한 숫자 표시
 */

const STAR_COUNT = 5;
const RATING_STEP = 0.5;

interface StarRatingInputProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

/** 별 하나(starIndex)가 현재 값(value) 기준으로 몇 %까지 채워지는지 계산한다 */
function computeStarFillPercent(starIndex: number, value: number): number {
  const starValue = starIndex + 1;
  if (value >= starValue) {
    return 100;
  }
  if (value <= starIndex) {
    return 0;
  }
  return (value - starIndex) * 100;
}

export function StarRatingInput({ value, onChange, readOnly = false }: StarRatingInputProps) {
  function renderStar(starIndex: number) {
    const fillPercent = computeStarFillPercent(starIndex, value);

    function handleHalfClick() {
      onChange?.(starIndex + RATING_STEP);
    }

    function handleFullClick() {
      onChange?.(starIndex + 1);
    }

    return (
      <span key={starIndex} className="relative inline-block h-6 w-6 text-2xl leading-none select-none">
        <span className="absolute inset-0 text-gray-300">★</span>
        <span
          className="absolute inset-0 overflow-hidden text-yellow-500"
          style={{ width: `${fillPercent}%` }}
        >
          ★
        </span>
        {!readOnly && (
          <>
            <button
              type="button"
              aria-label={`${starIndex + RATING_STEP}점`}
              onClick={handleHalfClick}
              className="absolute inset-y-0 left-0 w-1/2"
            />
            <button
              type="button"
              aria-label={`${starIndex + 1}점`}
              onClick={handleFullClick}
              className="absolute inset-y-0 right-0 w-1/2"
            />
          </>
        )}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: STAR_COUNT }, (_unused, index) => renderStar(index))}
      </div>
      <span className="text-sm text-gray-600">{value.toFixed(1)}</span>
    </div>
  );
}
