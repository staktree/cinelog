"use client";

/**
 * Supabase 인증 세션 Context
 * - SDD/회원가입로그인기능명세.md 9, 11, 12번 규칙: 로그인/로그아웃에 따라 전역 세션 상태를 갱신하고 유지한다
 */

import type { Session } from "@supabase/supabase-js";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface SessionContextValue {
  session: Session | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextValue>({ session: null, isLoading: true });

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });

    return function unsubscribe() {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return <SessionContext.Provider value={{ session, isLoading }}>{children}</SessionContext.Provider>;
}

/** 현재 로그인 세션 정보를 조회한다 */
export function useSession(): SessionContextValue {
  return useContext(SessionContext);
}
