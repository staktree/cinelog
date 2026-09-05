"use client";

/**
 * 감상평 작성/표시/수정 팝업
 * - SDD/워크플로우.md 3, 6, 7, 8번 규칙
 * - SDD/감상평수정기능명세.md 1~2번 규칙
 * - SDD/감상평조회기능명세.md 9번 규칙
 */

import { useEffect, useState } from "react";

import { ReviewDetailView } from "@/components/reviews/ReviewDetailView";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { fetchReviewDetail, submitNewReview, submitReviewEdit } from "@/lib/reviewApiClient";
import type { Review, ReviewInput } from "@/types/review";

type PopupMode = "create" | "detail";
type PopupViewState = "view" | "edit";

interface ReviewPopupProps {
  mode: PopupMode;
  reviewId?: string;
  /** Grid의 수정 버튼으로 진입한 경우 상세 로딩 직후 바로 수정 모드로 연다 (SDD/감상평조회기능명세.md 9번 규칙) */
  initialViewState?: PopupViewState;
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY_REVIEW_INPUT: ReviewInput = { title: "", rating: 3, content: "", summary: "" };

export function ReviewPopup({ mode, reviewId, initialViewState, onClose, onSaved }: ReviewPopupProps) {
  const [review, setReview] = useState<Review | null>(null);
  const [viewState, setViewState] = useState<PopupViewState>(
    mode === "create" ? "edit" : initialViewState ?? "view"
  );
  const [isLoading, setIsLoading] = useState(mode === "detail");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "detail" || !reviewId) {
      return;
    }
    const targetReviewId = reviewId;

    let isCancelled = false;

    async function loadReviewDetail() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const detail = await fetchReviewDetail(targetReviewId);
        if (!isCancelled) {
          setReview(detail);
        }
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage((error as Error).message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadReviewDetail();

    return function cancelLoad() {
      isCancelled = true;
    };
  }, [mode, reviewId]);

  function handleEditClick() {
    setViewState("edit");
  }

  function handleEditCancel() {
    setViewState("view");
  }

  async function handleCreateSubmit(input: ReviewInput) {
    await submitNewReview(input);
    onSaved();
  }

  async function handleEditSubmit(input: ReviewInput) {
    if (!reviewId) {
      return;
    }
    const updated = await submitReviewEdit(reviewId, input);
    setReview(updated);
    setViewState("view");
    onSaved();
  }

  function renderBody() {
    if (isLoading) {
      return <p className="py-8 text-center text-sm text-gray-500">불러오는 중...</p>;
    }
    if (mode === "detail" && errorMessage && !review) {
      return <p className="py-8 text-center text-sm text-red-600">{errorMessage}</p>;
    }
    if (mode === "create") {
      return (
        <ReviewForm initialValue={EMPTY_REVIEW_INPUT} onSubmit={handleCreateSubmit} onCancel={onClose} />
      );
    }
    if (!review) {
      return null;
    }
    if (viewState === "edit") {
      return <ReviewForm initialValue={review} onSubmit={handleEditSubmit} onCancel={handleEditCancel} />;
    }
    return <ReviewDetailView review={review} onEditClick={handleEditClick} />;
  }

  function getPopupTitle(): string {
    if (mode === "create") {
      return "감상평 작성";
    }
    return viewState === "edit" ? "감상평 수정" : "감상평";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{getPopupTitle()}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-gray-500 hover:text-gray-900"
          >
            ✕
          </button>
        </div>
        {renderBody()}
      </div>
    </div>
  );
}
