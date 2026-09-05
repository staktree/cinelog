/**
 * 회원가입/로그인 입력값 유효성 검증
 * - SDD/회원가입로그인기능명세.md 4번 규칙
 */

import { AuthValidationError } from "@/lib/errors";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

/** 이메일 형식을 검증한다. 위반 시 AuthValidationError를 던진다 */
export function validateEmail(email: string): void {
  if (!EMAIL_PATTERN.test(email)) {
    throw new AuthValidationError("올바른 이메일 형식을 입력해주세요.");
  }
}

/** 비밀번호가 최소 길이를 만족하는지 검증한다. 위반 시 AuthValidationError를 던진다 */
export function validatePassword(password: string): void {
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new AuthValidationError(`비밀번호는 최소 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`);
  }
}

/** 회원가입 시 비밀번호와 비밀번호 확인이 일치하는지 검증한다. 위반 시 AuthValidationError를 던진다 */
export function validatePasswordConfirmation(password: string, passwordConfirm: string): void {
  if (password !== passwordConfirm) {
    throw new AuthValidationError("비밀번호가 일치하지 않습니다.");
  }
}
