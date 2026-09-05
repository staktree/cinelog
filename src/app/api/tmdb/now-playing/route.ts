/**
 * TMDB 개봉 중인 영화 리스트 조회 API
 * - SDD/영화정보조회기능명세.md 2번 규칙
 */

import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/apiErrorHandler";
import { fetchNowPlayingMovies } from "@/lib/tmdb";

/** 오늘 날짜/지역 기준으로 개봉 중인 영화 리스트를 조회한다 */
export async function GET(): Promise<NextResponse> {
  try {
    const items = await fetchNowPlayingMovies();
    return NextResponse.json({ items });
  } catch (error) {
    return handleApiError(error);
  }
}
