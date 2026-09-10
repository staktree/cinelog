import type { SupabaseClient } from "@supabase/supabase-js";

import { NotFoundError } from "@/lib/errors/NotFoundError";
import { StorageError } from "@/lib/errors/StorageError";
import type { Review, ReviewInput } from "@/types/review";

import { buildReviewId, formatDatePrefix } from "./reviewIdGenerator";
import { validateReviewInput } from "./reviewValidator";

/** Supabase reviews 테이블의 행 형태 */
interface ReviewRow {
  id: string;
  title: string;
  rating: number;
  content: string;
  one_liner: string;
  created_at: string;
}

/** DB 행을 감상평 도메인 모델로 변환한다 */
function toReview(row: ReviewRow): Review {
  return {
    id: row.id,
    title: row.title,
    rating: row.rating,
    content: row.content,
    oneLiner: row.one_liner,
    createdAt: row.created_at,
  };
}

/** 오늘 날짜를 작성일자 형식(YYYY-MM-DD)으로 변환한다 */
function formatCreatedAt(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** 당일 다음 감상평ID를 Supabase RPC(next_review_sequence)로 원자적으로 발번받는다 */
async function nextReviewId(supabase: SupabaseClient, now: Date): Promise<string> {
  const datePrefix = formatDatePrefix(now);
  const { data, error } = await supabase.rpc("next_review_sequence", {
    p_date_prefix: datePrefix,
  });

  if (error || typeof data !== "number") {
    throw new StorageError(`감상평ID 발번 중 오류가 발생했습니다: ${error?.message ?? "unknown"}`);
  }
  return buildReviewId(datePrefix, data);
}

/** 로그인한 사용자 본인의 감상평을 모두 조회한다 (RLS로 본인 것만 반환된다) */
export async function findAllReviews(supabase: SupabaseClient): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    throw new StorageError(`감상평 목록 조회 중 오류가 발생했습니다: ${error.message}`);
  }
  return (data ?? []).map(toReview);
}

/** 감상평ID로 감상평을 조회한다. 없거나 본인 소유가 아니면 NotFoundError를 던진다 */
export async function findReviewById(supabase: SupabaseClient, id: string): Promise<Review> {
  const { data, error } = await supabase.from("reviews").select("*").eq("id", id).maybeSingle();

  if (error) {
    throw new StorageError(`감상평 조회 중 오류가 발생했습니다: ${error.message}`);
  }
  if (!data) {
    throw new NotFoundError(`감상평을 찾을 수 없습니다: ${id}`);
  }
  return toReview(data);
}

/** 감상평을 새로 작성하여 저장한다 (ID/작성일자는 서버에서 발번, user_id로 귀속) */
export async function createReview(
  supabase: SupabaseClient,
  userId: string,
  input: ReviewInput,
  now: Date = new Date(),
): Promise<Review> {
  validateReviewInput(input);

  const id = await nextReviewId(supabase, now);
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      id,
      user_id: userId,
      title: input.title,
      rating: input.rating,
      content: input.content,
      one_liner: input.oneLiner,
      created_at: formatCreatedAt(now),
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new StorageError(`감상평 저장 중 오류가 발생했습니다: ${error?.message ?? id}`);
  }
  return toReview(data);
}

/** 기존 감상평 내용을 수정하여 저장한다. 본인 소유가 아니면 NotFoundError를 던진다 (RLS) */
export async function updateReview(
  supabase: SupabaseClient,
  id: string,
  input: ReviewInput,
): Promise<Review> {
  validateReviewInput(input);

  const { data, error } = await supabase
    .from("reviews")
    .update({
      title: input.title,
      rating: input.rating,
      content: input.content,
      one_liner: input.oneLiner,
    })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new StorageError(`감상평 수정 중 오류가 발생했습니다: ${error.message}`);
  }
  if (!data) {
    throw new NotFoundError(`감상평을 찾을 수 없습니다: ${id}`);
  }
  return toReview(data);
}
