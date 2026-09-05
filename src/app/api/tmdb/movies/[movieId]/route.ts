/**
 * TMDB 영화 상세 정보 조회 API (영화 제목, 이미지 캐러셀, 관람평점, 관람평)
 * - SDD/영화정보조회기능명세.md 4~5번 규칙
 */

import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/apiErrorHandler";
import { TmdbApiError } from "@/lib/errors";
import { fetchMovieDetail } from "@/lib/tmdb";

interface RouteContext {
  params: Promise<{ movieId: string }>;
}

/** 영화ID로 영화 상세 정보를 조회한다 */
export async function GET(_request: NextRequest, context: RouteContext): Promise<NextResponse> {
  try {
    const { movieId } = await context.params;
    const movieIdNumber = Number(movieId);
    if (!Number.isInteger(movieIdNumber)) {
      throw new TmdbApiError("올바르지 않은 영화 ID입니다.", 400);
    }

    const detail = await fetchMovieDetail(movieIdNumber);
    return NextResponse.json(detail);
  } catch (error) {
    return handleApiError(error);
  }
}
