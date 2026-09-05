/**
 * 개봉 중인 영화 리스트 Grid
 * - SDD/영화정보조회기능명세.md 2~4번 규칙
 * - wireframe/화면구성_영화정보조회.png
 */

import type { KeyboardEvent } from "react";

import { buildPosterImageUrl } from "@/lib/tmdb";
import type { MovieSummary } from "@/types/movie";

interface MovieGridProps {
  items: MovieSummary[];
  onSelectMovie: (movieId: number) => void;
}

export function MovieGrid({ items, onSelectMovie }: MovieGridProps) {
  function renderCell(item: MovieSummary) {
    function handleClick() {
      onSelectMovie(item.id);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelectMovie(item.id);
      }
    }

    return (
      <li
        key={item.id}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        className="cursor-pointer rounded-md border border-gray-200 p-2 hover:bg-gray-50"
      >
        <span className="flex aspect-[2/3] w-full items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50">
          {item.posterPath ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={buildPosterImageUrl(item.posterPath)}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">포스터 없음</span>
          )}
        </span>
        <span className="mt-2 block truncate text-sm">{item.title}</span>
      </li>
    );
  }

  if (items.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-500">개봉 중인 영화가 없습니다.</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">{items.map(renderCell)}</ul>
  );
}
