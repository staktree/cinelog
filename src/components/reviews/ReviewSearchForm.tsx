"use client";

/**
 * 감상평 조회 조건 입력 폼 (제목 / 작성일자)
 * - SDD/감상평조회기능명세.md 5번 규칙
 */

import { useState } from "react";

import type { ReviewSearchCondition } from "@/types/review";

interface ReviewSearchFormProps {
  onSearch: (condition: ReviewSearchCondition) => void;
}

export function ReviewSearchForm({ onSearch }: ReviewSearchFormProps) {
  const [title, setTitle] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch({ title: title.trim() || undefined, createdAt: createdAt || undefined });
  }

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function handleCreatedAtChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCreatedAt(event.target.value);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="제목 조회 조건"
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <input
        type="date"
        value={createdAt}
        onChange={handleCreatedAtChange}
        aria-label="작성일 조회 조건"
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white"
      >
        조회
      </button>
    </form>
  );
}
