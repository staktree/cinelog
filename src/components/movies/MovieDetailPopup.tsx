"use client";

/**
 * 영화 상세 정보 팝업
 * - SDD/영화정보조회기능명세.md 4~5번 규칙: 영화 제목, 이미지 캐러셀, 관람평점, 관람평
 * - wireframe/화면구성_영화정보조회.png 우측 영역
 */

import { useEffect, useState } from "react";

import { MovieImageCarousel } from "@/components/movies/MovieImageCarousel";
import { fetchMovieDetailInfo } from "@/lib/movieApiClient";
import type { MovieDetail, MovieReviewItem } from "@/types/movie";

interface MovieDetailPopupProps {
  movieId: number;
  onClose: () => void;
}

export function MovieDetailPopup({ movieId, onClose }: MovieDetailPopupProps) {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadMovieDetail() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const detail = await fetchMovieDetailInfo(movieId);
        if (!isCancelled) {
          setMovie(detail);
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

    loadMovieDetail();

    return function cancelLoad() {
      isCancelled = true;
    };
  }, [movieId]);

  function renderReviewItem(review: MovieReviewItem) {
    return (
      <li key={review.id} className="border-b border-gray-100 py-2 last:border-b-0">
        <p className="text-xs font-semibold text-gray-500">{review.author}</p>
        <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{review.content}</p>
      </li>
    );
  }

  function renderBody() {
    if (isLoading) {
      return <p className="py-8 text-center text-sm text-gray-500">불러오는 중...</p>;
    }
    if (errorMessage || !movie) {
      return <p className="py-8 text-center text-sm text-red-600">{errorMessage}</p>;
    }

    return (
      <>
        <h2 className="mb-3 text-lg font-bold">{movie.title}</h2>
        <MovieImageCarousel images={movie.images} title={movie.title} />
        <p className="mt-4 text-sm font-semibold">
          관람평점 · ⭐ {movie.voteAverage.toFixed(1)} / 10
        </p>
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold">관람평</p>
          {movie.reviews.length === 0 ? (
            <p className="text-sm text-gray-500">등록된 관람평이 없습니다.</p>
          ) : (
            <ul className="max-h-48 overflow-y-auto">{movie.reviews.map(renderReviewItem)}</ul>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-end">
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
