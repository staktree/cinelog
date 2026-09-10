"use server";

import { toActionError, type ActionResult } from "@/lib/actions/actionResult";
import { fetchMovieDetail, fetchNowPlayingMovies } from "@/lib/movie/movieRepository";
import type { MovieDetail, MovieSummary } from "@/types/movie";

export type { ActionResult };

/** 오늘 날짜/지역 기준으로 개봉중인 영화 목록을 조회한다 (영화정보 메뉴 진입 시 호출) */
export async function listNowPlayingMoviesAction(): Promise<ActionResult<MovieSummary[]>> {
  try {
    const movies = await fetchNowPlayingMovies();
    return { success: true, data: movies };
  } catch (error) {
    return { success: false, error: toActionError(error) };
  }
}

/** 영화ID로 상세 정보를 조회한다 (리스트 셀 클릭 시 팝업 표시용) */
export async function getMovieDetailAction(movieId: number): Promise<ActionResult<MovieDetail>> {
  try {
    const detail = await fetchMovieDetail(movieId);
    return { success: true, data: detail };
  } catch (error) {
    return { success: false, error: toActionError(error) };
  }
}
