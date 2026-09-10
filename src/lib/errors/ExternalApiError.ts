import { AppError } from "./AppError";

/**
 * 외부 API(TMDB) 호출 중 오류가 발생했을 때 발생하는 에러
 */
export class ExternalApiError extends AppError {
  constructor(message: string) {
    super(message, "EXTERNAL_API_ERROR");
  }
}
