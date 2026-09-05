"use client";

/**
 * 영화 상세 정보 이미지 캐러셀 UI
 * - SDD/영화정보조회기능명세.md 5번 규칙: 이미지 캐러셀 UI
 */

import { useState } from "react";

import { buildPosterImageUrl } from "@/lib/tmdb";
import type { MovieImageItem } from "@/types/movie";

const CAROUSEL_IMAGE_SIZE = "w1280";

interface MovieImageCarouselProps {
  images: MovieImageItem[];
  title: string;
}

export function MovieImageCarousel({ images, title }: MovieImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  function handlePrevClick() {
    setCurrentIndex((previous) => (previous - 1 + images.length) % images.length);
  }

  function handleNextClick() {
    setCurrentIndex((previous) => (previous + 1) % images.length);
  }

  if (images.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-sm text-gray-400">
        표시할 이미지가 없습니다.
      </div>
    );
  }

  return (
    <div className="relative flex h-96 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={buildPosterImageUrl(images[currentIndex].filePath, CAROUSEL_IMAGE_SIZE)}
        alt={`${title} 이미지 ${currentIndex + 1}`}
        className="h-full w-full object-contain"
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrevClick}
            aria-label="이전 이미지"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-2 py-1 text-white"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={handleNextClick}
            aria-label="다음 이미지"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-2 py-1 text-white"
          >
            ›
          </button>
          <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
            {currentIndex + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
}
