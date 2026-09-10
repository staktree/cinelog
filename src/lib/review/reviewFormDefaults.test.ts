import type { Review } from "@/types/review";

import { toReviewInput } from "./reviewFormDefaults";

describe("toReviewInput", () => {
  it("저장된 감상평에서 ID와 작성일자를 제외한 입력값만 추출한다", () => {
    const review: Review = {
      id: "26082400001",
      title: "인터스텔라",
      rating: 4.5,
      content: "시간과 사랑에 대한 이야기가 인상적이었다.",
      oneLiner: "우주보다 넓은 사랑 이야기",
      createdAt: "2026-08-24",
    };

    const input = toReviewInput(review);

    expect(input).toEqual({
      title: "인터스텔라",
      rating: 4.5,
      content: "시간과 사랑에 대한 이야기가 인상적이었다.",
      oneLiner: "우주보다 넓은 사랑 이야기",
    });
  });
});
