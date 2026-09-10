"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { signInAction, signUpAction } from "@/app/actions/authActions";

type AuthMode = "login" | "signup";

/** 로그인/회원가입 화면 (SDD/로그인기능명세.md, 별도 와이어프레임 없이 기존 화면 톤에 맞춰 구현) */
export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
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

  function handleToggleMode() {
    setMode((current) => (current === "login" ? "signup" : "login"));
    setErrorMessage(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const action = mode === "login" ? signInAction : signUpAction;
    const result = await action({ email, password });

    setIsSubmitting(false);
    if (result.success) {
      router.push("/");
      router.refresh();
    } else {
      setErrorMessage(result.error.message);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-lg font-semibold text-zinc-900">
          {mode === "login" ? "로그인" : "회원가입"}
        </h1>

        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          이메일
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            placeholder="이메일을 입력해주세요"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          비밀번호
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            minLength={6}
            placeholder="비밀번호를 입력해주세요 (6자 이상)"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </label>

        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {mode === "login" ? "로그인" : "회원가입"}
        </button>

        <button
          type="button"
          onClick={handleToggleMode}
          className="text-sm text-zinc-500 underline underline-offset-2"
        >
          {mode === "login" ? "계정이 없으신가요? 회원가입" : "이미 계정이 있으신가요? 로그인"}
        </button>
      </form>
    </div>
  );
}
