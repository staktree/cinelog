import { AuthValidationError } from "@/lib/errors";
import { validateEmail, validatePassword, validatePasswordConfirmation } from "@/lib/authValidator";

describe("validateEmail", () => {
  it("올바른 이메일 형식은 통과한다", () => {
    expect(() => validateEmail("user@example.com")).not.toThrow();
  });

  it("이메일 형식이 아니면 AuthValidationError를 던진다", () => {
    expect(() => validateEmail("invalid-email")).toThrow(AuthValidationError);
  });
});

describe("validatePassword", () => {
  it("8자 이상이면 통과한다", () => {
    expect(() => validatePassword("password123")).not.toThrow();
  });

  it("8자 미만이면 AuthValidationError를 던진다", () => {
    expect(() => validatePassword("short")).toThrow(AuthValidationError);
  });
});

describe("validatePasswordConfirmation", () => {
  it("비밀번호와 확인 값이 같으면 통과한다", () => {
    expect(() => validatePasswordConfirmation("password123", "password123")).not.toThrow();
  });

  it("비밀번호와 확인 값이 다르면 AuthValidationError를 던진다", () => {
    expect(() => validatePasswordConfirmation("password123", "password456")).toThrow(
      AuthValidationError
    );
  });
});
