"use client";

/**
 * 영화 포스터 등록/표시 프레임
 * - SDD/감상평작성기능명세.md 10~14번 규칙
 * - SDD/감상평수정기능명세.md 2번 규칙: 수정 화면에서도 작성 화면과 동일하게 동작
 * - wireframe/화면 구성_감상평_작성.png, 화면 구성_감상평 표시.png 좌측 "감상평 이미지" 영역
 */

import { useRef, useState } from "react";

import { ImageSourceSelectDialog } from "@/components/reviews/ImageSourceSelectDialog";
import { MoviePosterSearchDialog } from "@/components/reviews/MoviePosterSearchDialog";
import { IMAGE_MAX_BYTES } from "@/lib/reviewValidator";

interface ReviewImageFrameProps {
  value?: string;
  onChange?: (dataUrl: string) => void;
  readOnly?: boolean;
}

/** File을 base64 Data URL(BLOB)로 변환한다 */
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ReviewImageFrame({ value, onChange, readOnly = false }: ReviewImageFrameProps) {
  const [isSourceDialogOpen, setIsSourceDialogOpen] = useState(false);
  const [isPosterSearchOpen, setIsPosterSearchOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFrameClick() {
    if (readOnly) {
      return;
    }
    setIsSourceDialogOpen(true);
  }

  function handleSelectLocal() {
    setIsSourceDialogOpen(false);
    fileInputRef.current?.click();
  }

  function handleSelectApi() {
    setIsSourceDialogOpen(false);
    setIsPosterSearchOpen(true);
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    if (file.size > IMAGE_MAX_BYTES) {
      window.alert("이미지는 최대 10MB까지 등록할 수 있습니다.");
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    onChange?.(dataUrl);
  }

  function handlePosterSelect(dataUrl: string) {
    setIsPosterSearchOpen(false);
    onChange?.(dataUrl);
  }

  return (
    <div className="w-48 shrink-0">
      <button
        type="button"
        onClick={handleFrameClick}
        disabled={readOnly}
        className="flex h-64 w-full flex-col items-start overflow-hidden rounded-md border border-gray-300 p-3 text-left disabled:cursor-default"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="영화 포스터" className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm text-gray-400">영화 포스터 등록</span>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {isSourceDialogOpen && (
        <ImageSourceSelectDialog
          onSelectLocal={handleSelectLocal}
          onSelectApi={handleSelectApi}
          onCancel={() => setIsSourceDialogOpen(false)}
        />
      )}

      {isPosterSearchOpen && (
        <MoviePosterSearchDialog
          onSelect={handlePosterSelect}
          onCancel={() => setIsPosterSearchOpen(false)}
        />
      )}
    </div>
  );
}
