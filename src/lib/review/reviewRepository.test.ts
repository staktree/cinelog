import type { SupabaseClient } from "@supabase/supabase-js";

import { NotFoundError } from "@/lib/errors/NotFoundError";
import { StorageError } from "@/lib/errors/StorageError";
import { ValidationError } from "@/lib/errors/ValidationError";
import type { ReviewInput } from "@/types/review";

import { createReview, findAllReviews, findReviewById, updateReview } from "./reviewRepository";

type FakeResult = { data?: unknown; error?: { message: string } | null };

function createValidInput(overrides: Partial<ReviewInput> = {}): ReviewInput {
  return {
    title: "인터스텔라",
    rating: 4.5,
    content: "시간과 사랑에 대한 이야기가 인상적이었다.",
    oneLiner: "우주보다 넓은 사랑 이야기",
    ...overrides,
  };
}

function createReviewRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "26082400001",
    title: "인터스텔라",
    rating: 4.5,
    content: "시간과 사랑에 대한 이야기가 인상적이었다.",
    one_liner: "우주보다 넓은 사랑 이야기",
    created_at: "2026-08-24",
    ...overrides,
  };
}

interface FakeChain {
  select: jest.Mock;
  eq: jest.Mock;
  insert: jest.Mock;
  update: jest.Mock;
  order: jest.Mock;
  single: jest.Mock;
  maybeSingle: jest.Mock;
}

/** select/insert/update가 체이닝되고, order/single/maybeSingle에서 결과를 반환하는 가짜 쿼리 빌더 */
function createFakeChain(result: FakeResult): FakeChain {
  const chain = {} as FakeChain;
  chain.select = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.insert = jest.fn(() => chain);
  chain.update = jest.fn(() => chain);
  chain.order = jest.fn(() => Promise.resolve(result));
  chain.single = jest.fn(() => Promise.resolve(result));
  chain.maybeSingle = jest.fn(() => Promise.resolve(result));
  return chain;
}

function createFakeSupabase(options: { fromResult?: FakeResult; rpcResult?: FakeResult }) {
  const chain = createFakeChain(options.fromResult ?? { data: null, error: null });
  return {
    from: jest.fn(() => chain),
    rpc: jest.fn(() => Promise.resolve(options.rpcResult ?? { data: 1, error: null })),
  } as unknown as SupabaseClient;
}

describe("findAllReviews", () => {
  it("조회된 행을 감상평 도메인 모델로 변환한다", async () => {
    const supabase = createFakeSupabase({ fromResult: { data: [createReviewRow()], error: null } });

    const reviews = await findAllReviews(supabase);

    expect(reviews).toEqual([
      {
        id: "26082400001",
        title: "인터스텔라",
        rating: 4.5,
        content: "시간과 사랑에 대한 이야기가 인상적이었다.",
        oneLiner: "우주보다 넓은 사랑 이야기",
        createdAt: "2026-08-24",
      },
    ]);
  });

  it("조회 중 오류가 발생하면 StorageError를 던진다", async () => {
    const supabase = createFakeSupabase({ fromResult: { data: null, error: { message: "network" } } });

    await expect(findAllReviews(supabase)).rejects.toThrow(StorageError);
  });

  it("DB에서 시간 정보가 포함된 작성일자가 내려와도 YYYY-MM-DD만 표시한다", async () => {
    const row = createReviewRow({ created_at: "2026-08-24T00:00:00+00:00" });
    const supabase = createFakeSupabase({ fromResult: { data: [row], error: null } });

    const reviews = await findAllReviews(supabase);

    expect(reviews[0].createdAt).toBe("2026-08-24");
  });
});

describe("findReviewById", () => {
  it("존재하는 감상평을 조회한다", async () => {
    const supabase = createFakeSupabase({ fromResult: { data: createReviewRow(), error: null } });

    const review = await findReviewById(supabase, "26082400001");

    expect(review.title).toBe("인터스텔라");
  });

  it("존재하지 않거나 본인 소유가 아니면(RLS) NotFoundError를 던진다", async () => {
    const supabase = createFakeSupabase({ fromResult: { data: null, error: null } });

    await expect(findReviewById(supabase, "99999999999")).rejects.toThrow(NotFoundError);
  });
});

describe("createReview", () => {
  it("유효성 검증을 통과하면 서버에서 발번된 ID로 저장한다", async () => {
    const supabase = createFakeSupabase({
      fromResult: { data: createReviewRow(), error: null },
      rpcResult: { data: 1, error: null },
    });
    const now = new Date(2026, 7, 24);

    const review = await createReview(supabase, "user-1", createValidInput(), now);

    expect(supabase.rpc).toHaveBeenCalledWith("next_review_sequence", { p_date_prefix: "260824" });
    expect(review.id).toBe("26082400001");
  });

  it("유효하지 않은 입력값이면 ValidationError를 던지고 발번을 시도하지 않는다", async () => {
    const supabase = createFakeSupabase({ fromResult: { data: null, error: null } });

    await expect(
      createReview(supabase, "user-1", createValidInput({ title: "" })),
    ).rejects.toThrow(ValidationError);
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it("ID 발번에 실패하면 StorageError를 던진다", async () => {
    const supabase = createFakeSupabase({ rpcResult: { data: null, error: { message: "db error" } } });

    await expect(createReview(supabase, "user-1", createValidInput())).rejects.toThrow(StorageError);
  });
});

describe("updateReview", () => {
  it("본인 소유 감상평을 수정한다", async () => {
    const updatedRow = createReviewRow({ title: "수정된 제목" });
    const supabase = createFakeSupabase({ fromResult: { data: updatedRow, error: null } });

    const review = await updateReview(supabase, "26082400001", createValidInput({ title: "수정된 제목" }));

    expect(review.title).toBe("수정된 제목");
  });

  it("존재하지 않거나 본인 소유가 아니면(RLS) NotFoundError를 던진다", async () => {
    const supabase = createFakeSupabase({ fromResult: { data: null, error: null } });

    await expect(updateReview(supabase, "99999999999", createValidInput())).rejects.toThrow(
      NotFoundError,
    );
  });
});
