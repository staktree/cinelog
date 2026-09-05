/**
 * Supabase 서버 클라이언트 (Route Handler에서 사용)
 * - 요청의 세션 쿠키를 읽어 RLS가 로그인한 사용자 기준으로 적용되도록 한다
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** 현재 요청의 쿠키를 기반으로 Supabase 서버 클라이언트를 생성한다 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Component에서 호출되면 쿠키 설정이 불가하므로 무시한다.
            // (미들웨어 - src/middleware.ts - 가 세션 쿠키 갱신을 담당한다)
          }
        },
      },
    }
  );
}
