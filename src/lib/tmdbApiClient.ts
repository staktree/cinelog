/**
 * TMDB 영화 포스터 검색 API 클라이언트 (브라우저 fetch 래퍼)
 */

import type { TmdbMovieSearchItem } from "@/types/review";

/** API 에러 응답 바디를 읽어 에러 메시지를 추출한다 */
async function extractErrorMessage(response: Response): Promise<string> {
  const body = await response.json().catch(() => null);
  return body?.message ?? "요청 처리 중 오류가 발생했습니다.";
}

/** 영화 제목으로 TMDB 포스터 검색 결과 목록을 조회한다 */
export async function searchTmdbMoviePosters(query: string): Promise<TmdbMovieSearchItem[]> {
  const response = await fetch(`/api/tmdb/movies?query=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }
  const { items } = (await response.json()) as { items: TmdbMovieSearchItem[] };
  return items;
}

/** 선택한 TMDB 포스터를 base64 Data URL(BLOB)로 변환하여 가져온다 */
export async function fetchTmdbPosterDataUrl(posterPath: string): Promise<string> {
  const response = await fetch(`/api/tmdb/poster?path=${encodeURIComponent(posterPath)}`);
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }
  const { dataUrl } = (await response.json()) as { dataUrl: string };
  return dataUrl;
}
