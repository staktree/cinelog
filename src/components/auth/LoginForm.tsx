"use client";

/**
 * 로그인 폼
 * - SDD/회원가입로그인기능명세.md 7~9번 규칙
 */

import { useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setIsSubmitting(false);
    if (error) {
      // SDD/회원가입로그인기능명세.md 8번 규칙
      setErrorMessage("이메일 또는 비밀번호가 일치하지 않습니다.");
    }
    // 로그인 성공 시 SessionProvider의 onAuthStateChange가 세션을 갱신하므로 별도 처리가 필요 없다.
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="이메일"
        required
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="비밀번호"
        required
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      />

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? "로그인 중..." : "로그인"}
      </button>
      <button
        type="button"
        onClick={onSwitchToSignup}
        className="text-center text-sm text-gray-500 underline"
      >
        회원가입하기
      </button>
    </form>
  );
}
