import { listNowPlayingMoviesAction } from "@/app/actions/movieActions";
import MovieBrowser from "@/components/movie/MovieBrowser";

// 개봉중인 영화 목록은 매일 갱신되므로, 정적 캐싱 없이 매 요청마다 새로 조회한다
export const dynamic = "force-dynamic";

/** 영화 정보 조회 화면 (메뉴바의 "영화 정보 확인하기" 선택 시 오픈) */
export default async function MoviesPage() {
  const initialResult = await listNowPlayingMoviesAction();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <MovieBrowser initialResult={initialResult} />
    </div>
  );
}
