import Modal from "@/components/ui/Modal";
import type { MovieDetail } from "@/types/movie";

import MovieCarousel from "./MovieCarousel";

interface MovieDetailModalProps {
  open: boolean;
  detail: MovieDetail | null;
  onClose: () => void;
}

/** 영화 상세 정보 팝업 (와이어프레임: 화면구성_영화정보조회.png, 리스트 셀 클릭 시 출력) */
export default function MovieDetailModal({ open, detail, onClose }: MovieDetailModalProps) {
  if (!open || !detail) {
    return null;
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">{detail.title}</h2>

        <MovieCarousel imageUrls={detail.imageUrls} title={detail.title} />

        <span className="self-start rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700">
          관람평점 {detail.voteAverage.toFixed(1)} / 10
        </span>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-zinc-700">관람평</h3>
          {detail.reviews.length === 0 ? (
            <p className="text-sm text-zinc-500">등록된 관람평이 없습니다.</p>
          ) : (
            <ul className="flex max-h-48 flex-col gap-3 overflow-y-auto">
              {detail.reviews.map((review) => (
                <li key={review.id} className="rounded-lg border border-zinc-200 p-3">
                  <p className="text-xs font-medium text-zinc-500">{review.author}</p>
                  <p className="mt-1 line-clamp-4 text-sm text-zinc-700">{review.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700"
          >
            닫기
          </button>
        </div>
      </div>
    </Modal>
  );
}
