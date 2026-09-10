/**
 * 감상평 도메인 모델 및 제약 조건
 * 참고: SDD/감상평작성기능명세.md
 */

export const REVIEW_TITLE_MAX_LENGTH = 30;
export const REVIEW_CONTENT_MAX_LENGTH = 2000;
export const REVIEW_ONE_LINER_MAX_LENGTH = 100;
export const REVIEW_RATING_MIN = 1;
export const REVIEW_RATING_MAX = 5;
export const REVIEW_RATING_STEP = 0.5;

/** 감상평 (감상평ID가 PK 역할 수행) */
export interface Review {
  /** 감상평ID, 형식: YYMMDD00001 (생성일자 6자리 + 5자리 순번) */
  id: string;
  /** 제목 (최대 30자) */
  title: string;
  /** 평점 (1~5, 0.5 단위) */
  rating: number;
  /** 감상평 (최대 2000자) */
  content: string;
  /** 한줄평 (최대 100자) */
  oneLiner: string;
  /** 작성일자 (YYYY-MM-DD) */
  createdAt: string;
}

/** 감상평 작성/수정 시 입력받는 값 (ID, 작성일자는 시스템이 발번) */
export type ReviewInput = Omit<Review, "id" | "createdAt">;
