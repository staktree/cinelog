/**
 * TMDB 포스터 이미지 → BLOB(base64 Data URL) 변환 API
 * - SDD/감상평작성기능명세.md 10, 14번 규칙
 */

import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/apiErrorHandler";
import { TmdbApiError } from "@/lib/errors";
import { fetchPosterAsDataUrl } from "@/lib/tmdb";

/** posterPath에 해당하는 TMDB 포스터 이미지를 base64 Data URL로 변환하여 반환한다 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const posterPath = request.nextUrl.searchParams.get("path");
    if (!posterPath) {
      throw new TmdbApiError("포스터 경로가 필요합니다.", 400);
    }

    const dataUrl = await fetchPosterAsDataUrl(posterPath);
    return NextResponse.json({ dataUrl });
  } catch (error) {
    return handleApiError(error);
  }
}
