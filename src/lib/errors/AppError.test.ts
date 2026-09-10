import { AppError } from "./AppError";
import { ValidationError } from "./ValidationError";

describe("AppError", () => {
  it("커스텀 에러는 code와 name을 가진다", () => {
    const error = new ValidationError("제목은 30자 이하여야 합니다.");

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.name).toBe("ValidationError");
    expect(error.message).toBe("제목은 30자 이하여야 합니다.");
  });
});
