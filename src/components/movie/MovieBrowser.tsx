"use client";

import { useState } from "react";

import { getMovieDetailAction, type ActionResult } from "@/app/actions/movieActions";
import type { MovieDetail, MovieSummary } from "@/types/movie";

import MovieDetailModal from "./MovieDetailModal";
import MovieGrid from "./MovieGrid";

interface MovieBrowserProps {
  initialResult: ActionResult<MovieSummary[]>;
}

type ModalState = { type: "none" } | { type: "detail"; detail: MovieDetail };

/** 영화 정보 조회 화면 전체를 조합하는 클라이언트 컴포넌트 */
export default function MovieBrowser({ initialResult }: MovieBrowserProps) {
  const [movies] = useState<MovieSummary[]>(initialResult.success ? initialResult.data : []);
  const [notice, setNotice] = useState<string | null>(
    initialResult.success ? null : initialResult.error.message,
  );
  const [modalState, setModalState] = useState<ModalState>({ type: "none" });

  async function handleSelectMovie(movieId: number) {
    const actionResult = await getMovieDetailAction(movieId);
    if (actionResult.success) {
      setNotice(null);
      setModalState({ type: "detail", detail: actionResult.data });
    } else {
      setNotice(actionResult.error.message);
    }
  }

  function handleCloseModal() {
    setModalState({ type: "none" });
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700">
        개봉중인 영화
      </h2>

      {notice && <p className="text-sm text-red-600">{notice}</p>}

      <MovieGrid movies={movies} onSelect={handleSelectMovie} />

      <MovieDetailModal
        open={modalState.type === "detail"}
        detail={modalState.type === "detail" ? modalState.detail : null}
        onClose={handleCloseModal}
      />
    </div>
  );
}
