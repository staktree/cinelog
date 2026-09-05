/**
 * 감상평 Supabase 저장소
 * - SDD/감상평작성기능명세.md 8~10번 규칙: Supabase Database/Storage에 저장
 * - SDD/감상평조회기능명세.md 0, 3번 규칙: 로그인한 사용자 본인의 감상평만 대상 (RLS로 제한)
 */

import type { SupabaseClient, User } from "@supabase/supabase-js";

import { AuthenticationError, ReviewNotFoundError, ReviewStorageError } from "@/lib/errors";
import { validateReviewInput } from "@/lib/reviewValidator";
import type { Review, ReviewInput, ReviewListResult, ReviewSearchCondition } from "@/types/review";

const REVIEWS_TABLE = "reviews";
const POSTER_BUCKET = "review-posters";
const SIGNED_URL_EXPIRES_IN_SECONDS = 60 * 60; // 1시간
const DATA_URL_PREFIX = "data:";
const REVIEW_DETAIL_COLUMNS = "id, title, rating, content, summary, poster_image_path, created_at, updated_at";

interface ReviewDetailRow {
  id: string;
  title: string;
  rating: number;
  content: string;
  summary: string;
  poster_image_path: string | null;
  created_at: string;
  updated_at: string;
}

/** 현재 로그인한 사용자를 조회한다. 세션이 없으면 AuthenticationError를 던진다 */
export async function requireAuthenticatedUser(supabase: SupabaseClient): Promise<User> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new AuthenticationError();
  }
  return data.user;
}

/** Postgres/Storage 에러를 감상평 저장소 에러로 변환한다 */
function toReviewStorageError(action: string, message: string): ReviewStorageError {
  return new ReviewStorageError(`감상평 ${action} 중 오류가 발생했습니다: ${message}`);
}

/** base64 Data URL을 Buffer와 콘텐츠 타입으로 분해한다 */
function decodeDataUrl(dataUrl: string): { buffer: Buffer; contentType: string } {
  const [header, base64Part = ""] = dataUrl.split(",");
  const contentType = header.match(/^data:(.*);base64$/)?.[1] ?? "image/jpeg";
  return { buffer: Buffer.from(base64Part, "base64"), contentType };
}

/** 포스터 이미지(base64 Data URL)를 Storage에 업로드하고 저장 경로를 반환한다 */
async function uploadPosterImage(
  supabase: SupabaseClient,
  userId: string,
  reviewId: string,
  dataUrl: string
): Promise<string> {
  const { buffer, contentType } = decodeDataUrl(dataUrl);
  const extension = contentType.split("/")[1] ?? "jpg";
  const storagePath = `${userId}/${reviewId}.${extension}`;

  const { error } = await supabase.storage
    .from(POSTER_BUCKET)
    .upload(storagePath, buffer, { contentType, upsert: true });

  if (error) {
    throw toReviewStorageError("이미지 업로드", error.message);
  }

  return storagePath;
}

/** 저장 경로 하나에 대한 서명된 URL을 조회한다. 실패 시 undefined를 반환한다 */
async function resolveSignedUrl(supabase: SupabaseClient, storagePath: string): Promise<string | undefined> {
  const { data } = await supabase.storage
    .from(POSTER_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_EXPIRES_IN_SECONDS);
  return data?.signedUrl;
}

/** 저장 경로 목록에 대한 서명된 URL을 일괄 조회한다 (경로 -> URL) */
async function resolveSignedUrls(
  supabase: SupabaseClient,
  storagePaths: string[]
): Promise<Map<string, string>> {
  if (storagePaths.length === 0) {
    return new Map();
  }

  const { data, error } = await supabase.storage
    .from(POSTER_BUCKET)
    .createSignedUrls(storagePaths, SIGNED_URL_EXPIRES_IN_SECONDS);

  if (error || !data) {
    return new Map();
  }

  const urlByPath = new Map<string, string>();
  data.forEach((signedUrlResult, index) => {
    if (signedUrlResult.signedUrl) {
      urlByPath.set(storagePaths[index], signedUrlResult.signedUrl);
    }
  });
  return urlByPath;
}

/** DB Row + 포스터 이미지 URL을 Review 타입으로 변환한다 */
function toReview(row: ReviewDetailRow, posterImageUrl: string | undefined): Review {
  return {
    reviewId: row.id,
    title: row.title,
    rating: row.rating,
    content: row.content,
    summary: row.summary,
    posterImage: posterImageUrl,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** 조건에 맞는 감상평을 최신순으로 페이징 조회한다 (RLS에 의해 본인 감상평만 조회됨) */
export async function searchReviews(
  supabase: SupabaseClient,
  condition: ReviewSearchCondition,
  page: number,
  pageSize: number
): Promise<ReviewListResult> {
  let query = supabase
    .from(REVIEWS_TABLE)
    .select("id, title, rating, poster_image_path, created_at", { count: "exact" });

  if (condition.title) {
    query = query.ilike("title", `%${condition.title}%`);
  }
  if (condition.createdAt) {
    query = query
      .gte("created_at", `${condition.createdAt}T00:00:00.000Z`)
      .lt("created_at", `${condition.createdAt}T23:59:59.999Z`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await query.order("created_at", { ascending: false }).range(from, to);

  if (error) {
    throw toReviewStorageError("목록 조회", error.message);
  }

  const rows = data ?? [];
  const posterPaths = rows
    .map((row) => row.poster_image_path)
    .filter((posterPath): posterPath is string => Boolean(posterPath));
  const urlByPath = await resolveSignedUrls(supabase, posterPaths);

  return {
    items: rows.map((row) => ({
      reviewId: row.id,
      title: row.title,
      rating: row.rating,
      createdAt: row.created_at,
      posterImage: row.poster_image_path ? urlByPath.get(row.poster_image_path) : undefined,
    })),
    page,
    pageSize,
    totalCount: count ?? 0,
  };
}

/** 감상평ID로 감상평 1건을 조회한다. 없으면(또는 본인 소유가 아니면) ReviewNotFoundError를 던진다 */
export async function readReviewById(supabase: SupabaseClient, reviewId: string): Promise<Review> {
  const { data, error } = await supabase
    .from(REVIEWS_TABLE)
    .select(REVIEW_DETAIL_COLUMNS)
    .eq("id", reviewId)
    .maybeSingle();

  if (error) {
    throw toReviewStorageError("조회", error.message);
  }
  if (!data) {
    throw new ReviewNotFoundError(reviewId);
  }

  const posterImageUrl = data.poster_image_path
    ? await resolveSignedUrl(supabase, data.poster_image_path)
    : undefined;

  return toReview(data, posterImageUrl);
}

/** 신규 감상평을 생성하고 저장한다 */
export async function createReview(
  supabase: SupabaseClient,
  userId: string,
  input: ReviewInput
): Promise<Review> {
  validateReviewInput(input);

  const { data: reviewId, error: idError } = await supabase.rpc("generate_review_id");
  if (idError || !reviewId) {
    throw toReviewStorageError("ID 발번", idError?.message ?? "알 수 없는 오류");
  }

  const posterImagePath =
    input.posterImage && input.posterImage.startsWith(DATA_URL_PREFIX)
      ? await uploadPosterImage(supabase, userId, reviewId as string, input.posterImage)
      : null;

  const { data, error } = await supabase
    .from(REVIEWS_TABLE)
    .insert({
      id: reviewId,
      user_id: userId,
      title: input.title,
      rating: input.rating,
      content: input.content,
      summary: input.summary,
      poster_image_path: posterImagePath,
    })
    .select(REVIEW_DETAIL_COLUMNS)
    .single();

  if (error || !data) {
    throw toReviewStorageError("저장", error?.message ?? "알 수 없는 오류");
  }

  const posterImageUrl = posterImagePath ? await resolveSignedUrl(supabase, posterImagePath) : undefined;
  return toReview(data, posterImageUrl);
}

/** 기존 감상평을 수정하고 저장한다. 대상이 없으면(또는 본인 소유가 아니면) ReviewNotFoundError를 던진다 */
export async function updateReview(
  supabase: SupabaseClient,
  userId: string,
  reviewId: string,
  input: ReviewInput
): Promise<Review> {
  validateReviewInput(input);

  const isNewImage = Boolean(input.posterImage?.startsWith(DATA_URL_PREFIX));
  const posterImagePath = isNewImage
    ? await uploadPosterImage(supabase, userId, reviewId, input.posterImage as string)
    : undefined;

  const updatePayload: Record<string, unknown> = {
    title: input.title,
    rating: input.rating,
    content: input.content,
    summary: input.summary,
  };
  if (posterImagePath !== undefined) {
    // 새 이미지가 업로드된 경우에만 경로를 갱신한다
    updatePayload.poster_image_path = posterImagePath;
  } else if (!input.posterImage) {
    // 이미지가 제거된 경우 경로를 비운다
    updatePayload.poster_image_path = null;
  }
  // 그 외(기존 이미지 URL을 그대로 전달받은 경우)에는 poster_image_path를 변경하지 않는다

  const { data, error } = await supabase
    .from(REVIEWS_TABLE)
    .update(updatePayload)
    .eq("id", reviewId)
    .select(REVIEW_DETAIL_COLUMNS)
    .maybeSingle();

  if (error) {
    throw toReviewStorageError("수정", error.message);
  }
  if (!data) {
    throw new ReviewNotFoundError(reviewId);
  }

  const posterImageUrl = data.poster_image_path
    ? await resolveSignedUrl(supabase, data.poster_image_path)
    : undefined;

  return toReview(data, posterImageUrl);
}

/** 감상평ID에 해당하는 감상평을 삭제한다. 대상이 없으면(또는 본인 소유가 아니면) ReviewNotFoundError를 던진다 */
export async function deleteReview(supabase: SupabaseClient, reviewId: string): Promise<void> {
  const { data, error } = await supabase
    .from(REVIEWS_TABLE)
    .delete()
    .eq("id", reviewId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw toReviewStorageError("삭제", error.message);
  }
  if (!data) {
    throw new ReviewNotFoundError(reviewId);
  }
}
