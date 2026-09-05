/**
 * 영화 정보 조회 도메인 타입
 * - SDD/영화정보조회기능명세.md 기준
 */

/** 개봉 중인 영화 리스트 셀 요약 정보 */
export interface MovieSummary {
  /** TMDB 영화 ID */
  id: number;
  /** 영화 제목 */
  title: string;
  /** 포스터 이미지 경로 (TMDB posterPath), 없을 수 있음 */
  posterPath: string | null;
}

/** 영화 상세 정보 팝업 이미지 캐러셀용 이미지 1건 */
export interface MovieImageItem {
  /** 이미지 경로 (TMDB filePath) */
  filePath: string;
}

/** 영화 상세 정보 팝업 관람평 1건 */
export interface MovieReviewItem {
  id: string;
  author: string;
  content: string;
}

/** 영화 상세 정보 (영화 제목, 이미지 캐러셀, 관람평점, 관람평) */
export interface MovieDetail {
  id: number;
  title: string;
  /** 관람평점 (TMDB voteAverage, 0~10) */
  voteAverage: number;
  images: MovieImageItem[];
  reviews: MovieReviewItem[];
}
