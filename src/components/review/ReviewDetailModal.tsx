import Modal from "@/components/ui/Modal";
import type { Review } from "@/types/review";

import StarRatingDisplay from "./StarRatingDisplay";

interface ReviewDetailModalProps {
  open: boolean;
  review: Review | null;
  onClose: () => void;
  onEdit: () => void;
}

/** 감상평 상세 표시 팝업 (와이어프레임: 화면 구성_감상평_표시.png) */
export default function ReviewDetailModal({ open, review, onClose, onEdit }: ReviewDetailModalProps) {
  if (!open || !review) {
    return null;
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">{review.title}</h2>

        <StarRatingDisplay value={review.rating} />

        <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-700">{review.content}</p>

        <p className="text-sm font-medium text-zinc-600">{review.oneLiner}</p>

        <span className="text-xs text-zinc-400">작성일 {review.createdAt}</span>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            편집하기
          </button>
        </div>
      </div>
    </Modal>
  );
}
