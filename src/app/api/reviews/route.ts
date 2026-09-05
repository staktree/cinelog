/**
 * 감상평 목록 조회(GET) / 신규 작성(POST) API
 * - SDD/감상평조회기능명세.md, SDD/감상평작성기능명세.md 기준
 * - 로그인한 사용자만 접근 가능 (Supabase RLS로 본인 감상평만 대상)
 */

import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/apiErrorHandler";
import { createReview, requireAuthenticatedUser, searchReviews } from "@/lib/reviewRepository";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ReviewInput, ReviewSearchCondition } from "@/types/review";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

/** 감상평 목록을 조건 검색 + 페이징하여 조회한다 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createSupabaseServerClient();
    await requireAuthenticatedUser(supabase);

    const searchParams = request.nextUrl.searchParams;
    const condition: ReviewSearchCondition = {
      title: searchParams.get("title") ?? undefined,
      createdAt: searchParams.get("createdAt") ?? undefined,
    };
    const page = Number(searchParams.get("page") ?? DEFAULT_PAGE);
    const pageSize = Number(searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE);

    const result = await searchReviews(supabase, condition, page, pageSize);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

/** 신규 감상평을 작성하고 저장한다 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createSupabaseServerClient();
    const user = await requireAuthenticatedUser(supabase);

    const input = (await request.json()) as ReviewInput;
    const review = await createReview(supabase, user.id, input);
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
