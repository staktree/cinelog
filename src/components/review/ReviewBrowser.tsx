"use client";

import { useState } from "react";

import {
  createReviewAction,
  getReviewAction,
  listReviewsAction,
  updateReviewAction,
  type ReviewListResult,
} from "@/app/actions/reviewActions";
import { DEFAULT_REVIEW_INPUT, toReviewInput } from "@/lib/review/reviewFormDefaults";
import type { Review } from "@/types/review";

import ReviewDetailModal from "./ReviewDetailModal";
import ReviewFormModal from "./ReviewFormModal";
import ReviewGrid from "./ReviewGrid";
import ReviewPagination from "./ReviewPagination";
import ReviewSearchBar, { type ReviewSearchCondition } from "./ReviewSearchBar";

interface ReviewBrowserProps {
  initialResult: ReviewListResult;
}

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "detail"; review: Review }
  | { type: "edit"; review: Review };

const EMPTY_CONDITION: ReviewSearchCondition = { title: "", createdAt: "" };

/** 감상평 조회 화면 전체를 조합하는 클라이언트 컴포넌트 (워크플로우 기준 초기 진입 화면) */
export default function ReviewBrowser({ initialResult }: ReviewBrowserProps) {
  const [condition, setCondition] = useState<ReviewSearchCondition>(EMPTY_CONDITION);
  const [result, setResult] = useState<ReviewListResult>(initialResult);
  const [modalState, setModalState] = useState<ModalState>({ type: "none" });
  const [notice, setNotice] = useState<string | null>(null);

  async function refreshList(nextCondition: ReviewSearchCondition, page: number) {
    const nextResult = await listReviewsAction({
      title: nextCondition.title,
      createdAt: nextCondition.createdAt,
      page,
    });
    setResult(nextResult);
  }

  function handleSearch(nextCondition: ReviewSearchCondition) {
    setCondition(nextCondition);
    refreshList(nextCondition, 1);
  }

  function handlePageChange(page: number) {
    refreshList(condition, page);
  }

  function handleOpenCreateModal() {
    setModalState({ type: "create" });
  }

  async function handleSelectReview(id: string) {
    const actionResult = await getReviewAction(id);
    if (actionResult.success) {
      setModalState({ type: "detail", review: actionResult.data });
    } else {
      setNotice(actionResult.error.message);
    }
  }

  function handleCloseModal() {
    setModalState({ type: "none" });
  }

  function handleStartEdit() {
    if (modalState.type === "detail") {
      setModalState({ type: "edit", review: modalState.review });
    }
  }

  function handleCreateSuccess() {
    setModalState({ type: "none" });
    refreshList(condition, 1);
  }

  function handleEditSuccess(updatedReview: Review) {
    setModalState({ type: "detail", review: updatedReview });
    refreshList(condition, result.page);
  }

  const editingReview = modalState.type === "edit" ? modalState.review : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ReviewSearchBar initialCondition={condition} onSearch={handleSearch} />
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          새 감상평 작성하기
        </button>
      </div>

      {notice && <p className="text-sm text-red-600">{notice}</p>}

      <ReviewGrid reviews={result.items} onSelect={handleSelectReview} />

      <ReviewPagination
        page={result.page}
        totalCount={result.totalCount}
        pageSize={result.pageSize}
        onPageChange={handlePageChange}
      />

      <ReviewFormModal
        open={modalState.type === "create"}
        mode="create"
        initialValues={DEFAULT_REVIEW_INPUT}
        onClose={handleCloseModal}
        onSubmit={createReviewAction}
        onSuccess={handleCreateSuccess}
      />

      <ReviewDetailModal
        open={modalState.type === "detail"}
        review={modalState.type === "detail" ? modalState.review : null}
        onClose={handleCloseModal}
        onEdit={handleStartEdit}
      />

      {editingReview && (
        <ReviewFormModal
          open={modalState.type === "edit"}
          mode="edit"
          initialValues={toReviewInput(editingReview)}
          onClose={handleCloseModal}
          onSubmit={(input) => updateReviewAction(editingReview.id, input)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
