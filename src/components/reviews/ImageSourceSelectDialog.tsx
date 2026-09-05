"use client";

/**
 * 감상평 이미지 등록 방식 선택 다이얼로그 (로컬 vs TMDB API)
 * - SDD/감상평작성기능명세.md 12번 규칙
 * - ReviewImageFrame이 ReviewForm의 <form> 내부에서 쓰이므로,
 *   HTML 스펙상 금지된 form 중첩을 피하기 위해 body에 Portal로 렌더링한다.
 */

import { createPortal } from "react-dom";

interface ImageSourceSelectDialogProps {
  onSelectLocal: () => void;
  onSelectApi: () => void;
  onCancel: () => void;
}

export function ImageSourceSelectDialog({
  onSelectLocal,
  onSelectApi,
  onCancel,
}: ImageSourceSelectDialogProps) {
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <p className="mb-6 text-center text-sm font-medium">이미지를 어떻게 등록할까요?</p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onSelectLocal}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            로컬에서 불러오기
          </button>
          <button
            type="button"
            onClick={onSelectApi}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            TMDB에서 영화 포스터 검색
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="mt-2 rounded-md px-4 py-2 text-sm text-gray-500 hover:bg-gray-50"
          >
            취소
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
