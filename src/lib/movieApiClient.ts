/**
 * 영화 정보 조회 API 클라이언트 (브라우저 fetch 래퍼)
 */

import type { MovieDetail, MovieSummary } from "@/types/movie";

/** API 에러 응답 바디를 읽어 에러 메시지를 추출한다 */
async function extractErrorMessage(response: Response): Promise<string> {
  const body = await response.json().catch(() => null);
  return body?.message ?? "요청 처리 중 오류가 발생했습니다.";
}

/** 오늘 날짜/지역 기준으로 개봉 중인 영화 리스트를 조회한다 */
export async function fetchNowPlayingMovieList(): Promise<MovieSummary[]> {
  const response = await fetch("/api/tmdb/now-playing");
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }
  const { items } = (await response.json()) as { items: MovieSummary[] };
  return items;
}

/** 영화ID로 영화 상세 정보(이미지 캐러셀, 관람평점, 관람평)를 조회한다 */
export async function fetchMovieDetailInfo(movieId: number): Promise<MovieDetail> {
  const response = await fetch(`/api/tmdb/movies/${movieId}`);
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }
  return (await response.json()) as MovieDetail;
}
