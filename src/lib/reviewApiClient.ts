/**
 * 감상평 API 클라이언트 (브라우저 fetch 래퍼)
 */

import type { Review, ReviewInput, ReviewListResult, ReviewSearchCondition } from "@/types/review";

/** API 에러 응답 바디를 읽어 에러 메시지를 추출한다 */
async function extractErrorMessage(response: Response): Promise<string> {
  const body = await response.json().catch(() => null);
  return body?.message ?? "요청 처리 중 오류가 발생했습니다.";
}

/** 검색 조건과 페이징 정보로 쿼리스트링을 생성한다 */
function buildListQueryString(
  condition: ReviewSearchCondition,
  page: number,
  pageSize: number
): string {
  const params = new URLSearchParams();
  if (condition.title) {
    params.set("title", condition.title);
  }
  if (condition.createdAt) {
    params.set("createdAt", condition.createdAt);
  }
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  return params.toString();
}

/** 조건에 맞는 감상평 목록을 조회한다 */
export async function fetchReviewList(
  condition: ReviewSearchCondition,
  page: number,
  pageSize: number
): Promise<ReviewListResult> {
  const queryString = buildListQueryString(condition, page, pageSize);
  const response = await fetch(`/api/reviews?${queryString}`);
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }
  return (await response.json()) as ReviewListResult;
}

/** 감상평ID로 감상평 상세를 조회한다 */
export async function fetchReviewDetail(reviewId: string): Promise<Review> {
  const response = await fetch(`/api/reviews/${reviewId}`);
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }
  return (await response.json()) as Review;
}

/** 신규 감상평을 작성한다 */
export async function submitNewReview(input: ReviewInput): Promise<Review> {
  const response = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }
  return (await response.json()) as Review;
}

/** 기존 감상평을 수정한다 */
export async function submitReviewEdit(reviewId: string, input: ReviewInput): Promise<Review> {
  const response = await fetch(`/api/reviews/${reviewId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }
  return (await response.json()) as Review;
}

/** 감상평ID에 해당하는 감상평을 삭제한다 */
export async function deleteReview(reviewId: string): Promise<void> {
  const response = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }
}
