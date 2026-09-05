/**
 * API Route 공통 에러 응답 처리
 */

import { NextResponse } from "next/server";

import {
  AppError,
  AuthenticationError,
  AuthValidationError,
  ReviewNotFoundError,
  ReviewValidationError,
  TmdbApiError,
} from "@/lib/errors";

/** 에러 종류에 맞는 HTTP 상태 코드를 결정한다 */
function resolveStatusCode(error: AppError): number {
  if (error instanceof ReviewNotFoundError) {
    return 404;
  }
  if (error instanceof ReviewValidationError || error instanceof AuthValidationError) {
    return 400;
  }
  if (error instanceof AuthenticationError) {
    return 401;
  }
  if (error instanceof TmdbApiError) {
    return error.statusCode ?? 502;
  }
  return 500;
}

/** 에러를 API 응답(NextResponse)으로 변환한다 */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    const status = resolveStatusCode(error);
    return NextResponse.json({ code: error.code, message: error.message }, { status });
  }

  console.error("예상하지 못한 서버 오류가 발생했습니다:", error);
  return NextResponse.json(
    { code: "INTERNAL_SERVER_ERROR", message: "서버 오류가 발생했습니다." },
    { status: 500 }
  );
}
