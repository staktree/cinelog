import type { Review, ReviewInput } from "@/types/review";

/** 감상평 작성 팝업의 기본 입력값 */
export const DEFAULT_REVIEW_INPUT: ReviewInput = {
  title: "",
  rating: 5,
  content: "",
  oneLiner: "",
};

/** 저장된 감상평을 수정 폼 입력값으로 변환한다 */
export function toReviewInput(review: Review): ReviewInput {
  return {
    title: review.title,
    rating: review.rating,
    content: review.content,
    oneLiner: review.oneLiner,
  };
}
