import Image from "next/image";

import type { MovieSummary } from "@/types/movie";

interface MovieGridProps {
  movies: MovieSummary[];
  onSelect: (movieId: number) => void;
}

/** 개봉중인 영화 리스트를 포스터/제목 카드로 표시한다 (와이어프레임: 화면구성_영화정보조회.png) */
export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-zinc-500">
        개봉중인 영화가 없습니다.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onSelect={onSelect} />
      ))}
    </div>
  );
}

interface MovieCardProps {
  movie: MovieSummary;
  onSelect: (movieId: number) => void;
}

/** 영화 포스터 카드. 클릭 시 상세 정보 팝업이 출력된다 */
function MovieCard({ movie, onSelect }: MovieCardProps) {
  function handleClick() {
    onSelect(movie.id);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-2 text-left transition hover:border-zinc-400"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-100">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-zinc-400">
            포스터 없음
          </div>
        )}
      </div>
      <span className="line-clamp-2 text-sm font-medium text-zinc-900">{movie.title}</span>
    </button>
  );
}
