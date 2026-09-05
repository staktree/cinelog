"use client";

/**
 * 감상평 작성_영화포스터 등록 팝업
 * - SDD/감상평작성기능명세.md 14번 규칙: TMDB API로 영화 포스터 검색/선택
 * - wireframe/화면 구성_감상평 작성_영화포스터등록.png
 * - ReviewImageFrame이 ReviewForm의 <form> 내부에서 쓰이므로 body에 Portal로 렌더링한다.
 *   (Portal은 DOM 트리만 분리할 뿐 React 이벤트는 컴포넌트 트리를 따라 버블링되므로,
 *   검색은 <form> submit이 아닌 버튼 클릭/Enter 키 입력으로 처리해 상위 폼의 저장 제출과
 *   섞이지 않도록 한다)
 */

import { useState } from "react";
import { createPortal } from "react-dom";

import { fetchTmdbPosterDataUrl, searchTmdbMoviePosters } from "@/lib/tmdbApiClient";
import { buildPosterImageUrl } from "@/lib/tmdb";
import type { TmdbMovieSearchItem } from "@/types/review";

interface MoviePosterSearchDialogProps {
  onSelect: (dataUrl: string) => void;
  onCancel: () => void;
}

export function MoviePosterSearchDialog({ onSelect, onCancel }: MoviePosterSearchDialogProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<TmdbMovieSearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectingId, setSelectingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  async function runSearch() {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return;
    }

    setIsSearching(true);
    setErrorMessage(null);
    try {
      const results = await searchTmdbMoviePosters(trimmedQuery);
      setItems(results.filter((item) => item.posterPath));
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsSearching(false);
    }
  }

  function handleSearchClick() {
    void runSearch();
  }

  function handleQueryKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    // 상위 ReviewForm의 저장 제출과 섞이지 않도록 폼 submit 대신 키 입력으로 검색을 실행한다
    if (event.key === "Enter") {
      event.preventDefault();
      void runSearch();
    }
  }

  async function handlePosterSelect(item: TmdbMovieSearchItem) {
    if (!item.posterPath || selectingId !== null) {
      return;
    }

    setSelectingId(item.id);
    setErrorMessage(null);
    try {
      const dataUrl = await fetchTmdbPosterDataUrl(item.posterPath);
      onSelect(dataUrl);
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setSelectingId(null);
    }
  }

  function renderPosterItem(item: TmdbMovieSearchItem) {
    if (!item.posterPath) {
      return null;
    }

    const isSelecting = selectingId === item.id;

    return (
      <li key={item.id} className="w-40 rounded-md border border-gray-300 p-2">
        <button
          type="button"
          onClick={() => handlePosterSelect(item)}
          disabled={selectingId !== null}
          className="flex w-full flex-col items-start gap-2 text-left disabled:opacity-50"
        >
          <span className="flex h-4 w-4 items-center justify-center border border-gray-400 text-[10px]">
            {isSelecting ? "…" : ""}
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={buildPosterImageUrl(item.posterPath)}
            alt={item.title}
            className="h-52 w-full rounded-sm object-cover"
          />
          <span className="w-full truncate text-xs text-gray-600">
            포스터 검색 결과 · {item.title}
            {item.releaseYear ? ` (${item.releaseYear})` : ""}
          </span>
        </button>
      </li>
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
      <div className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold">감상평 작성_영화포스터 등록</h3>
          <button
            type="button"
            onClick={onCancel}
            aria-label="닫기"
            className="text-gray-500 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleQueryKeyDown}
            placeholder="영화 제목으로 검색"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleSearchClick}
            disabled={isSearching}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {isSearching ? "검색 중..." : "검색"}
          </button>
        </div>

        {errorMessage && <p className="mb-2 text-sm text-red-600">{errorMessage}</p>}

        <ul className="flex flex-wrap gap-3 overflow-y-auto">{items.map(renderPosterItem)}</ul>
        {!isSearching && items.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">검색 결과가 없습니다.</p>
        )}
      </div>
    </div>,
    document.body
  );
}
