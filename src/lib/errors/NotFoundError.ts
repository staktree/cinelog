import { AppError } from "./AppError";

/**
 * 감상평ID로 데이터를 찾지 못했을 때 발생하는 에러
 */
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, "NOT_FOUND");
  }
}
