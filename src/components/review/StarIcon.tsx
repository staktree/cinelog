interface StarIconProps {
  className?: string;
}

/** 평점 표시/입력에 사용하는 별 아이콘 */
export default function StarIcon({ className }: StarIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.5l2.9 6.26 6.9.6-5.2 4.56 1.58 6.78L12 17.9l-6.18 3.8 1.58-6.78L2.2 9.36l6.9-.6L12 2.5z" />
    </svg>
  );
}
