/**
 * 감상평 도메인 타입 정의
 * - SDD/감상평작성기능명세.md 기준
 */

/** 감상평 원본 데이터 (JSON 저장 포맷) */
export interface Review {
  /** PK, 형식: YYYYMMDD00001 */
  reviewId: string;
  /** 영화 제목, 최대 30자 */
  title: string;
  /** 평점, 1~5, 0.5 단위 */
  rating: number;
  /** 감상평 본문, 최대 2000자 */
  content: string;
  /** 한줄평, 최대 100자 */
  summary: string;
  /** 영화 포스터 이미지, BLOB(base64 Data URL) 형식, 최대 10MB */
  posterImage?: string;
  /** 작성일자 (ISO 8601) */
  createdAt: string;
  /** 최종 수정일자 (ISO 8601), 수정 이력이 없으면 createdAt과 동일 */
  updatedAt: string;
}

/** 감상평 작성/수정 시 입력받는 폼 데이터 */
export type ReviewInput = Pick<Review, "title" | "rating" | "content" | "summary" | "posterImage">;

/** 감상평 조회 목록에 표시되는 요약 데이터 */
export type ReviewListItem = Pick<
  Review,
  "reviewId" | "title" | "rating" | "createdAt" | "posterImage"
>;

/** TMDB 영화 포스터 검색 결과 1건 */
export interface TmdbMovieSearchItem {
  id: number;
  title: string;
  posterPath: string | null;
  releaseYear: string | null;
}

/** 감상평 조회 조건 */
export interface ReviewSearchCondition {
  title?: string;
  createdAt?: string;
}

/** 페이징 처리된 목록 조회 결과 */
export interface ReviewListResult {
  items: ReviewListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
}
