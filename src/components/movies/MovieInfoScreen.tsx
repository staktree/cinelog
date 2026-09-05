"use client";

/**
 * 영화 정보 조회 화면 (메인화면 영역)
 * - SDD/영화정보조회기능명세.md 1~4번 규칙
 * - wireframe/화면구성_영화정보조회.png
 */

import { useEffect, useState } from "react";

import { MovieDetailPopup } from "@/components/movies/MovieDetailPopup";
import { MovieGrid } from "@/components/movies/MovieGrid";
import { fetchNowPlayingMovieList } from "@/lib/movieApiClient";
import type { MovieSummary } from "@/types/movie";

export function MovieInfoScreen() {
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadNowPlayingMovies() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const items = await fetchNowPlayingMovieList();
        if (!isCancelled) {
          setMovies(items);
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

    loadNowPlayingMovies();

    return function cancelLoad() {
      isCancelled = true;
    };
  }, []);

  function handleSelectMovie(movieId: number) {
    setSelectedMovieId(movieId);
  }

  function handlePopupClose() {
    setSelectedMovieId(null);
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-6">
      <h2 className="mb-4 text-base font-semibold">개봉중인 영화</h2>

      {isLoading && <p className="py-8 text-center text-sm text-gray-500">불러오는 중...</p>}

      {!isLoading && errorMessage && (
        <p className="py-8 text-center text-sm text-red-600">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && <MovieGrid items={movies} onSelectMovie={handleSelectMovie} />}

      {selectedMovieId !== null && (
        <MovieDetailPopup movieId={selectedMovieId} onClose={handlePopupClose} />
      )}
    </main>
  );
}
