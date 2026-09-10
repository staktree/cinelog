/**
 * 영화 정보 도메인 모델
 * 참고: SDD/영화정보조회기능명세.md
 */

/** 개봉중인 영화 리스트의 각 셀에 표시되는 정보 (포스터, 제목) */
export interface MovieSummary {
  /** TMDB 영화ID */
  id: number;
  /** 영화 제목 */
  title: string;
  /** 포스터 이미지 URL (TMDB에 등록된 이미지가 없으면 null) */
  posterUrl: string | null;
}

/** 관람평 (TMDB 리뷰) */
export interface MovieReview {
  /** TMDB 리뷰ID */
  id: string;
  /** 작성자 */
  author: string;
  /** 리뷰 내용 */
  content: string;
}

/** 영화 상세 정보 (상세 팝업에 표시) */
export interface MovieDetail {
  /** TMDB 영화ID */
  id: number;
  /** 영화 제목 */
  title: string;
  /** 이미지 캐러셀에 표시할 이미지 URL 목록 */
  imageUrls: string[];
  /** 관람평점 (TMDB 평균 평점, 10점 만점) */
  voteAverage: number;
  /** 관람평 목록 */
  reviews: MovieReview[];
}
