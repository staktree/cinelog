/**
 * TMDB 영화 포스터 검색 API
 * - SDD/감상평작성기능명세.md 14번 규칙: 영화제목으로 이미지를 조회
 */

import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/apiErrorHandler";
import { TmdbApiError } from "@/lib/errors";
import { searchMoviePosters } from "@/lib/tmdb";

/** 영화 제목으로 TMDB 포스터 검색 결과 목록을 조회한다 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const query = request.nextUrl.searchParams.get("query")?.trim();
    if (!query) {
      throw new TmdbApiError("검색할 영화 제목을 입력해주세요.", 400);
    }

    const items = await searchMoviePosters(query);
    return NextResponse.json({ items });
  } catch (error) {
    return handleApiError(error);
  }
}
