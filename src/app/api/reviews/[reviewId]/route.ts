/**
 * 감상평 단건 조회(GET) / 수정(PUT) / 삭제(DELETE) API
 * - SDD/감상평조회기능명세.md, SDD/감상평수정기능명세.md 기준
 * - 로그인한 사용자만 접근 가능 (Supabase RLS로 본인 감상평만 대상)
 */

import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/apiErrorHandler";
import { deleteReview, readReviewById, requireAuthenticatedUser, updateReview } from "@/lib/reviewRepository";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ReviewInput } from "@/types/review";

interface RouteContext {
  params: Promise<{ reviewId: string }>;
}

/** 감상평ID로 감상평 1건을 조회한다 */
export async function GET(_request: NextRequest, context: RouteContext): Promise<NextResponse> {
  try {
    const supabase = await createSupabaseServerClient();
    await requireAuthenticatedUser(supabase);

    const { reviewId } = await context.params;
    const review = await readReviewById(supabase, reviewId);
    return NextResponse.json(review);
  } catch (error) {
    return handleApiError(error);
  }
}

/** 감상평ID에 해당하는 감상평을 수정한다 */
export async function PUT(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  try {
    const supabase = await createSupabaseServerClient();
    const user = await requireAuthenticatedUser(supabase);

    const { reviewId } = await context.params;
    const input = (await request.json()) as ReviewInput;
    const review = await updateReview(supabase, user.id, reviewId, input);
    return NextResponse.json(review);
  } catch (error) {
    return handleApiError(error);
  }
}

/** 감상평ID에 해당하는 감상평을 삭제한다 */
export async function DELETE(_request: NextRequest, context: RouteContext): Promise<NextResponse> {
  try {
    const supabase = await createSupabaseServerClient();
    await requireAuthenticatedUser(supabase);

    const { reviewId } = await context.params;
    await deleteReview(supabase, reviewId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
