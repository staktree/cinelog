"use client";

import { useEffect, useState } from "react";

import type { ActionResult } from "@/app/actions/reviewActions";
import Modal from "@/components/ui/Modal";
import {
  REVIEW_CONTENT_MAX_LENGTH,
  REVIEW_ONE_LINER_MAX_LENGTH,
  REVIEW_TITLE_MAX_LENGTH,
  type Review,
  type ReviewInput,
} from "@/types/review";

import StarRatingInput from "./StarRatingInput";

export type ReviewFormMode = "create" | "edit";

interface ReviewFormModalProps {
  open: boolean;
  mode: ReviewFormMode;
  initialValues: ReviewInput;
  onClose: () => void;
  onSubmit: (input: ReviewInput) => Promise<ActionResult<Review>>;
  onSuccess: (review: Review) => void;
}

/** 감상평 작성/수정 팝업 (와이어프레임: 화면 구성_감상평_작성.png) */
export default function ReviewFormModal({
  open,
  mode,
  initialValues,
  onClose,
  onSubmit,
  onSuccess,
}: ReviewFormModalProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [rating, setRating] = useState(initialValues.rating);
  const [content, setContent] = useState(initialValues.content);
  const [oneLiner, setOneLiner] = useState(initialValues.oneLiner);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    setTitle(initialValues.title);
    setRating(initialValues.rating);
    setContent(initialValues.content);
    setOneLiner(initialValues.oneLiner);
    setErrorMessage(null);
  }, [open, initialValues]);

  if (!open) {
    return null;
  }

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);
  }

  function handleOneLinerChange(event: React.ChangeEvent<HTMLInputElement>) {
    setOneLiner(event.target.value);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await onSubmit({ title, rating, content, oneLiner });

    setIsSubmitting(false);
    if (result.success) {
      onSuccess(result.data);
    } else {
      setErrorMessage(result.error.message);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">
          {mode === "create" ? "감상평 작성" : "감상평 수정"}
        </h2>

        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          영화 제목
          <input
            value={title}
            onChange={handleTitleChange}
            maxLength={REVIEW_TITLE_MAX_LENGTH}
            placeholder="영화 제목을 입력해주세요"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </label>

        <div className="flex flex-col gap-1 text-sm text-zinc-700">
          평점
          <StarRatingInput value={rating} onChange={setRating} />
        </div>

        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          감상평
          <textarea
            value={content}
            onChange={handleContentChange}
            maxLength={REVIEW_CONTENT_MAX_LENGTH}
            rows={10}
            placeholder="감상평을 입력해주세요"
            className="resize-none rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
          <span className="self-end text-xs text-zinc-400">
            {content.length}/{REVIEW_CONTENT_MAX_LENGTH}
          </span>
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          한줄평
          <input
            value={oneLiner}
            onChange={handleOneLinerChange}
            maxLength={REVIEW_ONE_LINER_MAX_LENGTH}
            placeholder="한줄평을 입력해주세요"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </label>

        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            저장하기
          </button>
        </div>
      </form>
    </Modal>
  );
}
