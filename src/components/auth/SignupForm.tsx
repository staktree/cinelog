"use client";

/**
 * 회원가입 폼
 * - SDD/회원가입로그인기능명세.md 4~6번 규칙
 */

import { useState } from "react";

import { validateEmail, validatePassword, validatePasswordConfirmation } from "@/lib/authValidator";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  function handlePasswordConfirmChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPasswordConfirm(event.target.value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      validateEmail(email);
      validatePassword(password);
      validatePasswordConfirmation(password, passwordConfirm);
    } catch (error) {
      setErrorMessage((error as Error).message);
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({ email, password });

    setIsSubmitting(false);
    if (error) {
      // SDD/회원가입로그인기능명세.md 5번 규칙: 이미 가입된 이메일 등 회원가입 실패
      setErrorMessage(error.message);
      return;
    }
    // 회원가입 성공 시(이메일 확인이 꺼져 있으면) SessionProvider가 세션을 자동으로 갱신한다.
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
        placeholder="비밀번호 (8자 이상)"
        required
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <input
        type="password"
        value={passwordConfirm}
        onChange={handlePasswordConfirmChange}
        placeholder="비밀번호 확인"
        required
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      />

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? "가입 중..." : "회원가입"}
      </button>
      <button
        type="button"
        onClick={onSwitchToLogin}
        className="text-center text-sm text-gray-500 underline"
      >
        로그인으로 돌아가기
      </button>
    </form>
  );
}
