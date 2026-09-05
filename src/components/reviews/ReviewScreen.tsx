"use client";

/**
 * 감상평 조회 화면 (메인화면 영역)
 * - SDD/워크플로우.md 2번 규칙: 초기 접속 시 Default로 오픈
 * - SDD/감상평조회기능명세.md 0번 규칙: 로그인한 사용자만 접근 가능
 */

import { useEffect, useState } from "react";

import { AuthScreen } from "@/components/auth/AuthScreen";
import { useSession } from "@/components/auth/SessionProvider";
import { ReviewDeleteConfirmDialog } from "@/components/reviews/ReviewDeleteConfirmDialog";
import { ReviewGrid } from "@/components/reviews/ReviewGrid";
import { ReviewPagination } from "@/components/reviews/ReviewPagination";
import { ReviewPopup } from "@/components/reviews/ReviewPopup";
import { ReviewSearchForm } from "@/components/reviews/ReviewSearchForm";
import { deleteReview, fetchReviewList } from "@/lib/reviewApiClient";
import type { ReviewListResult, ReviewSearchCondition } from "@/types/review";

const PAGE_SIZE = 20;

type PopupState =
  | { mode: "create" }
  | { mode: "detail"; reviewId: string; initialViewState?: "view" | "edit" }
  | null;

export function ReviewScreen() {
  const { session, isLoading: isSessionLoading } = useSession();
  const [condition, setCondition] = useState<ReviewSearchCondition>({});
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<ReviewListResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [popupState, setPopupState] = useState<PopupState>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      return;
    }

    let isCancelled = false;

    async function loadReviewList() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const listResult = await fetchReviewList(condition, page, PAGE_SIZE);
        if (!isCancelled) {
          setResult(listResult);
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

    loadReviewList();

    return function cancelLoad() {
      isCancelled = true;
    };
  }, [condition, page, reloadKey, session]);

  function handleSearch(newCondition: ReviewSearchCondition) {
    setCondition(newCondition);
    setPage(1);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
  }

  function handleSelectReview(reviewId: string) {
    setPopupState({ mode: "detail", reviewId });
  }

  function handleEditReview(reviewId: string) {
    // SDD/감상평조회기능명세.md 9번 규칙: 수정 버튼 클릭 시 곧바로 수정 Pop-up 출력
    setPopupState({ mode: "detail", reviewId, initialViewState: "edit" });
  }

  function handleDeleteRequest(reviewId: string) {
    setDeleteTargetId(reviewId);
  }

  function handleDeleteCancel() {
    setDeleteTargetId(null);
  }

  async function handleDeleteConfirm() {
    if (!deleteTargetId) {
      return;
    }
    try {
      await deleteReview(deleteTargetId);
      setDeleteTargetId(null);
      setReloadKey((previous) => previous + 1);
    } catch (error) {
      setDeleteTargetId(null);
      setErrorMessage((error as Error).message);
    }
  }

  function handleCreateClick() {
    setPopupState({ mode: "create" });
  }

  function handlePopupClose() {
    setPopupState(null);
  }

  function handlePopupSaved() {
    // SDD/워크플로우.md 5번 규칙: 저장 완료 시 팝업이 사라지고 조회 화면을 한번 더 조회
    setPopupState(null);
    setReloadKey((previous) => previous + 1);
  }

  if (isSessionLoading) {
    return <p className="py-8 text-center text-sm text-gray-500">불러오는 중...</p>;
  }

  if (!session) {
    // SDD/감상평조회기능명세.md 0번 규칙: 비로그인 상태로 진입하면 로그인/회원가입 화면을 표시한다
    return <AuthScreen />;
  }

  return (
    <>
      <main className="mx-auto max-w-5xl px-6 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <ReviewSearchForm onSearch={handleSearch} />
          <button
            type="button"
            onClick={handleCreateClick}
            className="rounded-md border border-gray-900 px-4 py-2 text-sm font-medium"
          >
            새 감상평 작성하기
          </button>
        </div>

        {isLoading && <p className="py-8 text-center text-sm text-gray-500">불러오는 중...</p>}

        {!isLoading && errorMessage && (
          <p className="py-8 text-center text-sm text-red-600">{errorMessage}</p>
        )}

        {!isLoading && !errorMessage && result && (
          <>
            <ReviewGrid
              items={result.items}
              onSelectReview={handleSelectReview}
              onEditReview={handleEditReview}
              onDeleteReview={handleDeleteRequest}
            />
            <ReviewPagination
              page={result.page}
              pageSize={result.pageSize}
              totalCount={result.totalCount}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>

      {popupState && (
        <ReviewPopup
          mode={popupState.mode}
          reviewId={popupState.mode === "detail" ? popupState.reviewId : undefined}
          initialViewState={popupState.mode === "detail" ? popupState.initialViewState : undefined}
          onClose={handlePopupClose}
          onSaved={handlePopupSaved}
        />
      )}

      {deleteTargetId && (
        <ReviewDeleteConfirmDialog onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} />
      )}
    </>
  );
}
