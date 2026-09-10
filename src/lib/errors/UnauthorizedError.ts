import { AppError } from "./AppError";

/**
 * 로그인이 필요한 기능에 인증되지 않은 상태로 접근했을 때 발생하는 에러
 */
export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, "UNAUTHORIZED");
  }
}
