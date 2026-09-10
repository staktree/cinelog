"use server";

import { redirect } from "next/navigation";

import type { ActionResult } from "@/lib/actions/actionResult";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type { ActionResult };

/** 로그인/회원가입 입력값 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/** Supabase Auth 에러 메시지를 사용자에게 보여줄 한국어 문구로 변환한다 */
function toAuthErrorMessage(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }
  if (message.includes("User already registered")) {
    return "이미 가입된 이메일입니다.";
  }
  if (message.includes("Password should be at least")) {
    return "비밀번호는 6자 이상이어야 합니다.";
  }
  return message;
}

/** 이메일/비밀번호로 로그인한다 */
export async function signInAction(credentials: AuthCredentials): Promise<ActionResult<null>> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    return { success: false, error: { code: "AUTH_ERROR", message: toAuthErrorMessage(error.message) } };
  }
  return { success: true, data: null };
}

/** 이메일/비밀번호로 회원가입한다 (SDD/로그인기능명세.md 4번: 이메일 인증 없이 가입 즉시 로그인) */
export async function signUpAction(credentials: AuthCredentials): Promise<ActionResult<null>> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp(credentials);

  if (error) {
    return { success: false, error: { code: "AUTH_ERROR", message: toAuthErrorMessage(error.message) } };
  }
  // Supabase 프로젝트의 Confirm email 설정이 켜져 있으면 세션 없이 가입만 되어
  // 화면상 아무 반응이 없는 것처럼 보인다. 명세대로 가입 즉시 로그인되어야 하므로 명확히 알려준다.
  if (!data.session) {
    return {
      success: false,
      error: {
        code: "AUTH_ERROR",
        message:
          "이메일 인증 대기 상태로 가입되어 즉시 로그인되지 않았습니다. Supabase 대시보드 Authentication 설정에서 Confirm email을 비활성화해주세요.",
      },
    };
  }
  return { success: true, data: null };
}

/** 로그아웃하고 로그인 화면으로 이동한다 */
export async function signOutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
