"use client";

import { useState } from "react";

export interface ReviewSearchCondition {
  title: string;
  createdAt: string;
}

interface ReviewSearchBarProps {
  initialCondition: ReviewSearchCondition;
  onSearch: (condition: ReviewSearchCondition) => void;
}

/** 제목/작성일자 조회 조건 입력 영역 (와이어프레임: 제목 조회 조건 / 작성일 조회 조건 / 조회 버튼) */
export default function ReviewSearchBar({ initialCondition, onSearch }: ReviewSearchBarProps) {
  const [title, setTitle] = useState(initialCondition.title);
  const [createdAt, setCreatedAt] = useState(initialCondition.createdAt);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSearch({ title, createdAt });
  }

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function handleCreatedAtChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCreatedAt(event.target.value);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="제목으로 조회"
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
      />
      <input
        type="date"
        value={createdAt}
        onChange={handleCreatedAtChange}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
      >
        조회
      </button>
    </form>
  );
}
