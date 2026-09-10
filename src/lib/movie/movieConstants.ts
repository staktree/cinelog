/**
 * 영화 정보 조회 관련 상수
 * 참고: SDD/영화정보조회기능명세.md
 */

/** TMDB "개봉중인 영화(now playing)" 조회 시 사용하는 지역 코드 (한국 기준) */
export const TMDB_REGION = "KR";
/** TMDB API 응답 언어 */
export const TMDB_LANGUAGE = "ko-KR";
/** 리스트 셀에 사용하는 포스터 이미지 크기 */
export const TMDB_POSTER_SIZE = "w342";
/** 상세 팝업 이미지 캐러셀에 사용하는 이미지 크기 */
export const TMDB_BACKDROP_SIZE = "w780";
/** 상세 팝업 이미지 캐러셀에 표시할 최대 이미지 수 */
export const MOVIE_CAROUSEL_IMAGE_LIMIT = 5;
/** 상세 팝업에 표시할 최대 관람평 수 */
export const MOVIE_REVIEW_LIMIT = 5;
/** now_playing 조회 시 최대로 가져올 페이지 수 (과도한 API 호출 방지) */
export const TMDB_NOW_PLAYING_MAX_PAGE = 10;
