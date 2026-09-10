import { AppError } from "./AppError";

/**
 * 감상평 파일 저장/조회 중 파일 시스템 오류가 발생했을 때 발생하는 에러
 */
export class StorageError extends AppError {
  constructor(message: string) {
    super(message, "STORAGE_ERROR");
  }
}
