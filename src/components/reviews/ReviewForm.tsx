"use client";

/**
 * 감상평 작성/수정 공용 입력 폼
 * - SDD/감상평작성기능명세.md 1~2, 7~8번 규칙
 * - SDD/감상평수정기능명세.md 2번 규칙
 */

import { useState } from "react";

import { ReviewImageFrame } from "@/components/reviews/ReviewImageFrame";
import { StarRatingInput } from "@/components/reviews/StarRatingInput";
import { validateReviewInput } from "@/lib/reviewValidator";
import type { ReviewInput } from "@/types/review";

const TITLE_MAX_LENGTH = 30;
const CONTENT_MAX_LENGTH = 2000;
const SUMMARY_MAX_LENGTH = 100;

interface ReviewFormProps {
  initialValue: ReviewInput;
  onSubmit: (input: ReviewInput) => Promise<void>;
  onCancel: () => void;
}

export function ReviewForm({ initialValue, onSubmit, onCancel }: ReviewFormProps) {
  const [title, setTitle] = useState(initialValue.title);
  const [rating, setRating] = useState(initialValue.rating);
  const [content, setContent] = useState(initialValue.content);
  const [summary, setSummary] = useState(initialValue.summary);
  const [posterImage, setPosterImage] = useState(initialValue.posterImage);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function handleRatingChange(nextRating: number) {
    setRating(nextRating);
  }

  function handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);
  }

  function handleSummaryChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSummary(event.target.value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input: ReviewInput = { title, rating, content, summary, posterImage };
    try {
      validateReviewInput(input);
    } catch (error) {
      setErrorMessage((error as Error).message);
      return;
    }

    setErrorMessage(null);
    setIsSaving(true);
    try {
      await onSubmit(input);
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="영화 제목 작성"
          maxLength={TITLE_MAX_LENGTH}
          className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <StarRatingInput value={rating} onChange={handleRatingChange} />
      </div>

      <div className="flex gap-4">
        <ReviewImageFrame value={posterImage} onChange={setPosterImage} />
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="감상평 작성"
          maxLength={CONTENT_MAX_LENGTH}
          rows={12}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400"
        />
      </div>

      <input
        type="text"
        value={summary}
        onChange={handleSummaryChange}
        placeholder="한줄평 작성"
        maxLength={SUMMARY_MAX_LENGTH}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      />

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSaving ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </form>
  );
}
