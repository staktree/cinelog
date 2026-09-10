"use client";

import Image from "next/image";
import { useState } from "react";

interface MovieCarouselProps {
  imageUrls: string[];
  title: string;
}

/** 영화 상세 팝업의 이미지 캐러셀 UI (좌우 버튼으로 이미지를 전환한다) */
export default function MovieCarousel({ imageUrls, title }: MovieCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (imageUrls.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-lg bg-zinc-100 text-sm text-zinc-400">
        이미지가 없습니다.
      </div>
    );
  }

  function handlePrevious() {
    setCurrentIndex((index) => (index === 0 ? imageUrls.length - 1 : index - 1));
  }

  function handleNext() {
    setCurrentIndex((index) => (index === imageUrls.length - 1 ? 0 : index + 1));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-56 w-full overflow-hidden rounded-lg bg-zinc-100">
        <Image
          src={imageUrls[currentIndex]}
          alt={`${title} 이미지 ${currentIndex + 1}`}
          fill
          sizes="600px"
          className="object-cover"
        />
        {imageUrls.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              aria-label="이전 이미지"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-2.5 py-1 text-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="다음 이미지"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-2.5 py-1 text-white"
            >
              ›
            </button>
          </>
        )}
      </div>
      {imageUrls.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {imageUrls.map((imageUrl, index) => (
            <span
              key={imageUrl}
              className={`h-1.5 w-1.5 rounded-full ${
                index === currentIndex ? "bg-zinc-900" : "bg-zinc-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
