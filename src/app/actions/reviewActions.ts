"use server";

import { toActionError, type ActionResult } from "@/lib/actions/actionResult";
import { UnauthorizedError } from "@/lib/errors/UnauthorizedError";
import { REVIEW_PAGE_SIZE } from "@/lib/review/reviewConstants";
import * as reviewRepository from "@/lib/review/reviewRepository";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Review, ReviewInput } from "@/types/review";

export type { ActionResult };

/** 감상평 조회 조건 (제목/작성일자, 페이지) */
export interface ReviewListQuery {
  title?: string;
  createdAt?: string;
  page?: number;
}

/** 감상평 목록 조회 결과 (페이지네이션 포함) */
export interface ReviewListResult {
  items: Review[];
  totalCount: number;
  page: number;
  pageSize: number;
}

/** 로그인한 사용자의 Supabase 클라이언트를 가져온다. 로그인하지 않았으면 UnauthorizedError를 던진다 */
async function requireAuthenticatedClient() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new UnauthorizedError("로그인이 필요합니다.");
  }
  return { supabase, userId: user.id };
}

/** 제목/작성일자 조건으로 감상평 목록을 필터링한다 */
function filterReviews(reviews: Review[], query: ReviewListQuery): Review[] {
  return reviews.filter((review) => {
    const matchesTitle = query.title ? review.title.includes(query.title) : true;
    const matchesCreatedAt = query.createdAt ? review.createdAt === query.createdAt : true;
    return matchesTitle && matchesCreatedAt;
  });
}

/** 감상평 목록을 페이지 단위로 잘라낸다 */
function paginateReviews(reviews: Review[], page: number, pageSize: number): Review[] {
  const startIndex = (page - 1) * pageSize;
  return reviews.slice(startIndex, startIndex + pageSize);
}

/**
 * 감상평 목록을 조회한다 (조회화면 진입/검색/페이지 이동 시 호출)
 * 로그인한 사용자 본인의 감상평만 반환된다 (Supabase RLS)
 */
export async function listReviewsAction(query: ReviewListQuery = {}): Promise<ReviewListResult> {
  const page = query.page && query.page > 0 ? query.page : 1;

  try {
    const { supabase } = await requireAuthenticatedClient();
    const allReviews = await reviewRepository.findAllReviews(supabase);
    const filtered = filterReviews(allReviews, query);
    const items = paginateReviews(filtered, page, REVIEW_PAGE_SIZE);

    return {
      items,
      totalCount: filtered.length,
      page,
      pageSize: REVIEW_PAGE_SIZE,
    };
  } catch {
    // 로그인 화면 진입 전 잠깐이라도 빈 목록으로 처리한다 (실제 접근 제어는 proxy.ts가 담당)
    return { items: [], totalCount: 0, page, pageSize: REVIEW_PAGE_SIZE };
  }
}

/** 감상평ID로 단건 조회한다 (Grid 클릭 시 팝업 표시용) */
export async function getReviewAction(id: string): Promise<ActionResult<Review>> {
  try {
    const { supabase } = await requireAuthenticatedClient();
    const review = await reviewRepository.findReviewById(supabase, id);
    return { success: true, data: review };
  } catch (error) {
    return { success: false, error: toActionError(error) };
  }
}

/** 감상평을 새로 작성하여 저장한다 (로그인한 사용자에게 귀속) */
export async function createReviewAction(input: ReviewInput): Promise<ActionResult<Review>> {
  try {
    const { supabase, userId } = await requireAuthenticatedClient();
    const review = await reviewRepository.createReview(supabase, userId, input);
    return { success: true, data: review };
  } catch (error) {
    return { success: false, error: toActionError(error) };
  }
}

/** 기존 감상평을 수정하여 저장한다 (본인 소유가 아니면 NotFoundError) */
export async function updateReviewAction(id: string, input: ReviewInput): Promise<ActionResult<Review>> {
  try {
    const { supabase } = await requireAuthenticatedClient();
    const review = await reviewRepository.updateReview(supabase, id, input);
    return { success: true, data: review };
  } catch (error) {
    return { success: false, error: toActionError(error) };
  }
}
