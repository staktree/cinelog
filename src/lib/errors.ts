/**
 * 커스텀 에러 클래스 정의
 * - CLAUDE.md 코딩 컨벤션: 에러는 반드시 커스텀 에러 클래스로 처리
 */

/** 애플리케이션 공통 에러 베이스 클래스 */
export class AppError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "AppError";
    this.code = code;
  }
}

/** 감상평을 찾을 수 없을 때 발생하는 에러 */
export class ReviewNotFoundError extends AppError {
  constructor(reviewId: string) {
    super(`감상평을 찾을 수 없습니다: ${reviewId}`, "REVIEW_NOT_FOUND");
    this.name = "ReviewNotFoundError";
  }
}

/** 감상평 입력값이 유효성 검증에 실패했을 때 발생하는 에러 */
export class ReviewValidationError extends AppError {
  constructor(message: string) {
    super(message, "REVIEW_VALIDATION_ERROR");
    this.name = "ReviewValidationError";
  }
}

/** 감상평 파일 저장/조회 중 발생하는 에러 */
export class ReviewStorageError extends AppError {
  constructor(message: string) {
    super(message, "REVIEW_STORAGE_ERROR");
    this.name = "ReviewStorageError";
  }
}

/** TMDB API 호출 중 발생하는 에러 */
export class TmdbApiError extends AppError {
  constructor(message: string, readonly statusCode?: number) {
    super(message, "TMDB_API_ERROR");
    this.name = "TmdbApiError";
  }
}

/** 로그인하지 않은 상태로 인증이 필요한 기능에 접근했을 때 발생하는 에러 */
export class AuthenticationError extends AppError {
  constructor(message: string = "로그인이 필요합니다.") {
    super(message, "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}

/** 회원가입/로그인 입력값이 유효성 검증에 실패했을 때 발생하는 에러 */
export class AuthValidationError extends AppError {
  constructor(message: string) {
    super(message, "AUTH_VALIDATION_ERROR");
    this.name = "AuthValidationError";
  }
}
