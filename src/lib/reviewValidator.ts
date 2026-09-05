/**
 * 감상평 입력값 유효성 검증
 * - SDD/감상평작성기능명세.md 1~2번 규칙 기준
 */

import { ReviewValidationError } from "@/lib/errors";
import type { ReviewInput } from "@/types/review";

const TITLE_MAX_LENGTH = 30;
const CONTENT_MAX_LENGTH = 2000;
const SUMMARY_MAX_LENGTH = 100;
const RATING_MIN = 1;
const RATING_MAX = 5;
const RATING_STEP = 0.5;
export const IMAGE_MAX_BYTES = 10 * 1024 * 1024;

/** base64 Data URL(posterImage)의 원본 바이트 크기를 계산한다 */
function calculateBase64ByteSize(dataUrl: string): number {
  const base64Part = dataUrl.split(",")[1] ?? "";
  const paddingCount = base64Part.endsWith("==") ? 2 : base64Part.endsWith("=") ? 1 : 0;
  return Math.floor((base64Part.length * 3) / 4) - paddingCount;
}

/** 평점이 1~5 범위의 0.5 단위 숫자인지 검증한다 */
function isValidRating(rating: number): boolean {
  if (rating < RATING_MIN || rating > RATING_MAX) {
    return false;
  }
  const stepCount = rating / RATING_STEP;
  return Number.isInteger(Math.round(stepCount * 1e6) / 1e6);
}

/** 감상평 작성/수정 입력값을 검증한다. 위반 시 ReviewValidationError를 던진다 */
export function validateReviewInput(input: ReviewInput): void {
  if (!input.title || input.title.trim().length === 0) {
    throw new ReviewValidationError("영화 제목을 입력해주세요.");
  }
  if (input.title.length > TITLE_MAX_LENGTH) {
    throw new ReviewValidationError(`영화 제목은 최대 ${TITLE_MAX_LENGTH}자까지 입력할 수 있습니다.`);
  }
  if (!isValidRating(input.rating)) {
    throw new ReviewValidationError(
      `평점은 ${RATING_MIN}~${RATING_MAX} 사이의 ${RATING_STEP}단위 숫자여야 합니다.`
    );
  }
  if (input.content.length > CONTENT_MAX_LENGTH) {
    throw new ReviewValidationError(`감상평은 최대 ${CONTENT_MAX_LENGTH}자까지 입력할 수 있습니다.`);
  }
  if (input.summary.length > SUMMARY_MAX_LENGTH) {
    throw new ReviewValidationError(`한줄평은 최대 ${SUMMARY_MAX_LENGTH}자까지 입력할 수 있습니다.`);
  }
  if (input.posterImage && calculateBase64ByteSize(input.posterImage) > IMAGE_MAX_BYTES) {
    throw new ReviewValidationError("이미지는 최대 10MB까지 저장할 수 있습니다.");
  }
}
