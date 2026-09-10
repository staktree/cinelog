import { ValidationError } from "@/lib/errors/ValidationError";
import {
  REVIEW_CONTENT_MAX_LENGTH,
  REVIEW_ONE_LINER_MAX_LENGTH,
  REVIEW_RATING_MAX,
  REVIEW_RATING_MIN,
  REVIEW_RATING_STEP,
  REVIEW_TITLE_MAX_LENGTH,
  type ReviewInput,
} from "@/types/review";

/** 제목 유효성을 검증한다 */
function validateTitle(title: string): void {
  if (!title || title.trim().length === 0) {
    throw new ValidationError("제목을 입력해주세요.");
  }
  if (title.length > REVIEW_TITLE_MAX_LENGTH) {
    throw new ValidationError(`제목은 최대 ${REVIEW_TITLE_MAX_LENGTH}자까지 입력할 수 있습니다.`);
  }
}

/** 평점 유효성을 검증한다 (1~5, 0.5 단위) */
function validateRating(rating: number): void {
  if (typeof rating !== "number" || Number.isNaN(rating)) {
    throw new ValidationError("평점을 입력해주세요.");
  }
  if (rating < REVIEW_RATING_MIN || rating > REVIEW_RATING_MAX) {
    throw new ValidationError(`평점은 ${REVIEW_RATING_MIN}~${REVIEW_RATING_MAX} 사이여야 합니다.`);
  }

  const stepRatio = rating / REVIEW_RATING_STEP;
  const isValidStep = Math.abs(stepRatio - Math.round(stepRatio)) < Number.EPSILON * 10;
  if (!isValidStep) {
    throw new ValidationError(`평점은 ${REVIEW_RATING_STEP} 단위로 입력해야 합니다.`);
  }
}

/** 감상평 본문 유효성을 검증한다 */
function validateContent(content: string): void {
  if (!content || content.trim().length === 0) {
    throw new ValidationError("감상평을 입력해주세요.");
  }
  if (content.length > REVIEW_CONTENT_MAX_LENGTH) {
    throw new ValidationError(`감상평은 최대 ${REVIEW_CONTENT_MAX_LENGTH}자까지 입력할 수 있습니다.`);
  }
}

/** 한줄평 유효성을 검증한다 */
function validateOneLiner(oneLiner: string): void {
  if (!oneLiner || oneLiner.trim().length === 0) {
    throw new ValidationError("한줄평을 입력해주세요.");
  }
  if (oneLiner.length > REVIEW_ONE_LINER_MAX_LENGTH) {
    throw new ValidationError(`한줄평은 최대 ${REVIEW_ONE_LINER_MAX_LENGTH}자까지 입력할 수 있습니다.`);
  }
}

/** 감상평 작성/수정 입력값 전체를 검증한다. 위반 시 ValidationError를 던진다 */
export function validateReviewInput(input: ReviewInput): void {
  validateTitle(input.title);
  validateRating(input.rating);
  validateContent(input.content);
  validateOneLiner(input.oneLiner);
}
