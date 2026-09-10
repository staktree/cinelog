import { AppError } from "@/lib/errors/AppError";

/** 서버 액션 처리 결과. 실패 시 커스텀 에러 정보를 담아 클라이언트에 전달한다 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

/** 커스텀 에러를 클라이언트에 전달 가능한 형태로 변환한다 */
export function toActionError(error: unknown): { code: string; message: string } {
  if (error instanceof AppError) {
    return { code: error.code, message: error.message };
  }
  return { code: "UNKNOWN_ERROR", message: "알 수 없는 오류가 발생했습니다." };
}
