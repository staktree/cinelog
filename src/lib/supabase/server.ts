import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** 서버 컴포넌트/서버 액션에서 사용하는 Supabase 클라이언트를 생성한다 (쿠키 기반 세션) */
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
            // Server Component에서 호출된 경우 쓰기가 불가능하다.
            // 세션 갱신은 proxy.ts에서 처리하므로 여기서는 무시한다.
          }
        },
      },
    },
  );
}
