"use client";

/**
 * 감상평 삭제 확인 다이얼로그
 * - SDD/감상평조회기능명세.md 10번 규칙
 */

interface ReviewDeleteConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function ReviewDeleteConfirmDialog({ onConfirm, onCancel }: ReviewDeleteConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <p className="mb-6 text-center text-sm">선택한 감상평을 삭제하시겠습니까?</p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md border border-red-600 bg-red-600 px-4 py-2 text-sm font-medium text-white"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
