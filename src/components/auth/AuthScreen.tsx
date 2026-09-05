"use client";

/**
 * 로그인/회원가입 화면
 * - SDD/회원가입로그인기능명세.md 2번 규칙: 비로그인 상태로 감상평 메뉴 진입 시 표시
 */

import { useState } from "react";

import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

type AuthMode = "login" | "signup";

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>("login");

  function handleSwitchToSignup() {
    setMode("signup");
  }

  function handleSwitchToLogin() {
    setMode("login");
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h2 className="mb-6 text-center text-lg font-bold">{mode === "login" ? "로그인" : "회원가입"}</h2>
      {mode === "login" ? (
        <LoginForm onSwitchToSignup={handleSwitchToSignup} />
      ) : (
        <SignupForm onSwitchToLogin={handleSwitchToLogin} />
      )}
    </main>
  );
}
