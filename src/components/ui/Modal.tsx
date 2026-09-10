import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

/** 메인화면 위에 표시되는 공통 팝업(Pop-up) 레이어 */
export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) {
    return null;
  }

  function handleOverlayClick() {
    onClose();
  }

  function handleContentClick(event: React.MouseEvent) {
    event.stopPropagation();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={handleContentClick}
      >
        {children}
      </div>
    </div>
  );
}
