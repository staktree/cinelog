import { ReviewValidationError } from "@/lib/errors";
import { validateReviewInput } from "@/lib/reviewValidator";
import type { ReviewInput } from "@/types/review";

function createValidInput(overrides: Partial<ReviewInput> = {}): ReviewInput {
  return {
    title: "인터스텔라",
    rating: 4.5,
    content: "훌륭한 영화였습니다.",
    summary: "시간과 사랑에 대한 이야기",
    ...overrides,
  };
}

describe("validateReviewInput", () => {
  it("유효한 입력은 에러를 던지지 않는다", () => {
    expect(() => validateReviewInput(createValidInput())).not.toThrow();
  });

  it("제목이 비어있으면 ReviewValidationError를 던진다", () => {
    expect(() => validateReviewInput(createValidInput({ title: "" }))).toThrow(ReviewValidationError);
  });

  it("제목이 30자를 초과하면 ReviewValidationError를 던진다", () => {
    const longTitle = "가".repeat(31);
    expect(() => validateReviewInput(createValidInput({ title: longTitle }))).toThrow(
      ReviewValidationError
    );
  });

  it("평점이 0.5 단위가 아니면 ReviewValidationError를 던진다", () => {
    expect(() => validateReviewInput(createValidInput({ rating: 4.3 }))).toThrow(
      ReviewValidationError
    );
  });

  it("평점이 1~5 범위를 벗어나면 ReviewValidationError를 던진다", () => {
    expect(() => validateReviewInput(createValidInput({ rating: 5.5 }))).toThrow(
      ReviewValidationError
    );
    expect(() => validateReviewInput(createValidInput({ rating: 0.5 }))).toThrow(
      ReviewValidationError
    );
  });

  it("감상평이 2000자를 초과하면 ReviewValidationError를 던진다", () => {
    const longContent = "가".repeat(2001);
    expect(() => validateReviewInput(createValidInput({ content: longContent }))).toThrow(
      ReviewValidationError
    );
  });

  it("한줄평이 100자를 초과하면 ReviewValidationError를 던진다", () => {
    const longSummary = "가".repeat(101);
    expect(() => validateReviewInput(createValidInput({ summary: longSummary }))).toThrow(
      ReviewValidationError
    );
  });

  it("이미지가 없으면 에러를 던지지 않는다", () => {
    expect(() => validateReviewInput(createValidInput({ posterImage: undefined }))).not.toThrow();
  });

  it("이미지가 10MB를 초과하면 ReviewValidationError를 던진다", () => {
    const oversizedBase64 = "A".repeat(15 * 1024 * 1024);
    const posterImage = `data:image/jpeg;base64,${oversizedBase64}`;
    expect(() => validateReviewInput(createValidInput({ posterImage }))).toThrow(
      ReviewValidationError
    );
  });
});
