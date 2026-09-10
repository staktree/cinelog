import { ValidationError } from "@/lib/errors/ValidationError";
import type { ReviewInput } from "@/types/review";

import { validateReviewInput } from "./reviewValidator";

function createValidInput(overrides: Partial<ReviewInput> = {}): ReviewInput {
  return {
    title: "인터스텔라",
    rating: 4.5,
    content: "시간과 사랑에 대한 이야기가 인상적이었다.",
    oneLiner: "우주보다 넓은 사랑 이야기",
    ...overrides,
  };
}

describe("validateReviewInput", () => {
  it("유효한 입력값은 에러를 던지지 않는다", () => {
    expect(() => validateReviewInput(createValidInput())).not.toThrow();
  });

  it("제목이 비어있으면 ValidationError를 던진다", () => {
    expect(() => validateReviewInput(createValidInput({ title: "" }))).toThrow(ValidationError);
  });

  it("제목이 30자를 초과하면 ValidationError를 던진다", () => {
    const longTitle = "가".repeat(31);
    expect(() => validateReviewInput(createValidInput({ title: longTitle }))).toThrow(ValidationError);
  });

  it("평점이 1 미만이면 ValidationError를 던진다", () => {
    expect(() => validateReviewInput(createValidInput({ rating: 0.5 }))).toThrow(ValidationError);
  });

  it("평점이 5를 초과하면 ValidationError를 던진다", () => {
    expect(() => validateReviewInput(createValidInput({ rating: 5.5 }))).toThrow(ValidationError);
  });

  it("평점이 0.5 단위가 아니면 ValidationError를 던진다", () => {
    expect(() => validateReviewInput(createValidInput({ rating: 3.2 }))).toThrow(ValidationError);
  });

  it("감상평이 2000자를 초과하면 ValidationError를 던진다", () => {
    const longContent = "가".repeat(2001);
    expect(() => validateReviewInput(createValidInput({ content: longContent }))).toThrow(ValidationError);
  });

  it("한줄평이 100자를 초과하면 ValidationError를 던진다", () => {
    const longOneLiner = "가".repeat(101);
    expect(() => validateReviewInput(createValidInput({ oneLiner: longOneLiner }))).toThrow(ValidationError);
  });
});
