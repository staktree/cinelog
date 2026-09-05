/**
 * 로컬 JSON 감상평(savedData/review) 데이터를 Supabase(Database + Storage)로 1회 이전하는 스크립트
 * - 실행: npx ts-node scripts/migrateReviewsToSupabase.ts <이전할 사용자 UUID>
 * - 이전할 사용자 UUID는 Supabase 대시보드의 Authentication > Users에서 확인한다
 *   (먼저 회원가입으로 계정을 하나 만든 뒤, 그 계정의 UUID로 실행한다)
 * - .env.local에 NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY가 설정되어 있어야 한다
 * - service role key는 RLS를 우회하므로 이 스크립트에서만 사용하고 서버/클라이언트 코드에는 절대 노출하지 않는다
 */

import { promises as fs } from "fs";
import path from "path";

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const REVIEW_STORAGE_DIR = path.join(process.cwd(), "savedData", "review");
const POSTER_BUCKET = "review-posters";

interface LegacyReview {
  reviewId: string;
  title: string;
  rating: number;
  content: string;
  summary: string;
  posterImage?: string;
  createdAt: string;
  updatedAt: string;
}

/** base64 Data URL을 Buffer와 콘텐츠 타입으로 분해한다 */
function decodeDataUrl(dataUrl: string): { buffer: Buffer; contentType: string } {
  const [header, base64Part = ""] = dataUrl.split(",");
  const contentType = header.match(/^data:(.*);base64$/)?.[1] ?? "image/jpeg";
  return { buffer: Buffer.from(base64Part, "base64"), contentType };
}

async function readLegacyReviews(): Promise<LegacyReview[]> {
  const fileNames = (await fs.readdir(REVIEW_STORAGE_DIR)).filter((name) => name.endsWith(".json"));
  const reviews = await Promise.all(
    fileNames.map(async (fileName) => {
      const raw = await fs.readFile(path.join(REVIEW_STORAGE_DIR, fileName), "utf-8");
      return JSON.parse(raw) as LegacyReview;
    })
  );
  return reviews;
}

async function main(): Promise<void> {
  const targetUserId = process.argv[2];
  if (!targetUserId) {
    console.error("사용법: npx ts-node scripts/migrateReviewsToSupabase.ts <이전할 사용자 UUID>");
    process.exitCode = 1;
    return;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경변수가 필요합니다.");
    process.exitCode = 1;
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const legacyReviews = await readLegacyReviews();
  console.log(`이전 대상 감상평 ${legacyReviews.length}건 발견`);

  for (const review of legacyReviews) {
    let posterImagePath: string | null = null;

    if (review.posterImage) {
      const { buffer, contentType } = decodeDataUrl(review.posterImage);
      const extension = contentType.split("/")[1] ?? "jpg";
      posterImagePath = `${targetUserId}/${review.reviewId}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(POSTER_BUCKET)
        .upload(posterImagePath, buffer, { contentType, upsert: true });

      if (uploadError) {
        console.error(`[${review.reviewId}] 이미지 업로드 실패: ${uploadError.message}`);
        posterImagePath = null;
      }
    }

    const { error: insertError } = await supabase.from("reviews").insert({
      id: review.reviewId,
      user_id: targetUserId,
      title: review.title,
      rating: review.rating,
      content: review.content,
      summary: review.summary,
      poster_image_path: posterImagePath,
      created_at: review.createdAt,
      updated_at: review.updatedAt,
    });

    if (insertError) {
      console.error(`[${review.reviewId}] 삽입 실패: ${insertError.message}`);
      continue;
    }

    console.log(`[${review.reviewId}] 이전 완료`);
  }
}

main().catch((error) => {
  console.error("마이그레이션 중 예상하지 못한 오류가 발생했습니다:", error);
  process.exitCode = 1;
});
