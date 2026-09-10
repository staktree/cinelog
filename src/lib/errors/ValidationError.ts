import { AppError } from "./AppError";

/**
 * 감상평 입력값 유효성 검증 실패 시 발생하는 에러
 * (예: 제목 30자 초과, 평점 범위 초과 등)
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
  }
}
