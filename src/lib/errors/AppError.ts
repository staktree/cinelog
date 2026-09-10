/**
 * 애플리케이션 전역에서 사용하는 커스텀 에러 베이스 클래스
 * 모든 커스텀 에러는 이 클래스를 상속받아 구현한다.
 */
export class AppError extends Error {
  /** 에러 식별 코드 (예: VALIDATION_ERROR, NOT_FOUND 등) */
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
