/**
 * TMDB(The Movie Database) API 연동 모듈
 * - CLAUDE.md 코딩 컨벤션: Named Function, 커스텀 에러 클래스 사용
 * - SDD/감상평작성기능명세.md 14번 규칙: 영화 포스터 검색/등록
 */
import { TmdbApiError } from "@/lib/errors";
import { IMAGE_MAX_BYTES } from "@/lib/reviewValidator";
import type { MovieDetail, MovieSummary } from "@/types/movie";
import type { TmdbMovieSearchItem } from "@/types/review";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const POSTER_SEARCH_SIZE = "w300";
const POSTER_STORAGE_SIZE = "w500";
/** 개봉 중인 영화를 조회할 지역 (SDD/영화정보조회기능명세.md 2번 규칙: 지역 기준) */
const NOW_PLAYING_REGION = "KR";

interface TmdbMovieSearchResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
}

interface TmdbNowPlayingResult {
  id: number;
  title: string;
  poster_path: string | null;
}

interface TmdbMovieDetailResult {
  id: number;
  title: string;
  vote_average: number;
  /** 영화가 공식으로 등록한 대표 포스터 경로 */
  poster_path: string | null;
  /** 영화가 공식으로 등록한 대표 배경 이미지 경로 */
  backdrop_path: string | null;
}

interface TmdbMovieImageResult {
  file_path: string;
  /** 이미지에 포함된 텍스트 언어. null이면 텍스트가 없는 원본(textless) 이미지 */
  iso_639_1: string | null;
}

interface TmdbMovieReviewResult {
  id: string;
  author: string;
  content: string;
}

/** TMDB API 공통 요청 함수 */
async function requestTmdb<T>(path: string): Promise<T> {
  const accessToken = process.env.TMDB_API_ACCESS_TOKEN;

  if (!accessToken) {
    throw new TmdbApiError("TMDB_API_ACCESS_TOKEN 환경변수가 설정되지 않았습니다.");
  }

  const response = await fetch(`${TMDB_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new TmdbApiError(`TMDB API 요청에 실패했습니다: ${path}`, response.status);
  }

  return response.json() as Promise<T>;
}

/** TMDB API 연결 확인용 함수 (인증/네트워크 상태 점검) */
export function checkTmdbConnection() {
  return requestTmdb<{ images: unknown; change_keys: string[] }>("/configuration");
}

/** 영화 제목으로 검색 */
function searchMovie(query: string) {
  return requestTmdb<{ results: TmdbMovieSearchResult[] }>(
    `/search/movie?query=${encodeURIComponent(query)}&language=ko-KR`
  );
}

/** 영화 제목으로 포스터 검색 결과 목록을 조회한다 (감상평 작성_영화포스터 등록 팝업) */
export async function searchMoviePosters(query: string): Promise<TmdbMovieSearchItem[]> {
  const { results } = await searchMovie(query);
  return results.map((result) => ({
    id: result.id,
    title: result.title,
    posterPath: result.poster_path,
    releaseYear: result.release_date ? result.release_date.slice(0, 4) : null,
  }));
}

/** posterPath로 TMDB 포스터 이미지 URL을 생성한다 */
export function buildPosterImageUrl(posterPath: string, size: string = POSTER_SEARCH_SIZE): string {
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
}

/** TMDB 포스터 이미지를 다운로드하여 base64 Data URL(BLOB)로 변환한다. 10MB 초과 시 TmdbApiError를 던진다 */
export async function fetchPosterAsDataUrl(posterPath: string): Promise<string> {
  const imageUrl = buildPosterImageUrl(posterPath, POSTER_STORAGE_SIZE);
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new TmdbApiError(`포스터 이미지를 불러오지 못했습니다: ${posterPath}`, response.status);
  }

  const arrayBuffer = await response.arrayBuffer();
  if (arrayBuffer.byteLength > IMAGE_MAX_BYTES) {
    throw new TmdbApiError("이미지는 최대 10MB까지 저장할 수 있습니다.");
  }

  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return `data:${contentType};base64,${base64}`;
}

/** 오늘 날짜/지역(대한민국) 기준으로 개봉 중인 영화 리스트를 조회한다 */
export async function fetchNowPlayingMovies(): Promise<MovieSummary[]> {
  const { results } = await requestTmdb<{ results: TmdbNowPlayingResult[] }>(
    `/movie/now_playing?language=ko-KR&region=${NOW_PLAYING_REGION}&page=1`
  );
  return results.map((result) => ({
    id: result.id,
    title: result.title,
    posterPath: result.poster_path,
  }));
}

/** 캐러셀에 추가로 노출할 배경 이미지 최대 개수 */
const MAX_CAROUSEL_BACKDROP_COUNT = 8;

/**
 * 영화가 공식으로 등록한 대표 배경(backdrop) 이미지를 맨 앞에 두고,
 * 언어별 텍스트가 덧입혀진 중복 이미지는 제외한 채(textless만) 배경 이미지만 이어붙인다.
 * (포스터는 캐러셀에서 제외하고 배경 이미지만 사용한다)
 */
function buildCarouselImagePaths(
  detail: TmdbMovieDetailResult,
  backdrops: TmdbMovieImageResult[]
): string[] {
  const officialBackdropPath = detail.backdrop_path;

  const distinctBackdropPaths = backdrops
    // 언어별로 로고/자막이 덧입혀진 동일 원본의 중복 이미지를 제외하고 textless 원본만 사용한다
    .filter((backdrop) => backdrop.iso_639_1 === null)
    .map((backdrop) => backdrop.file_path)
    .filter((filePath) => filePath !== officialBackdropPath)
    .slice(0, MAX_CAROUSEL_BACKDROP_COUNT);

  const officialPaths = officialBackdropPath ? [officialBackdropPath] : [];
  return [...new Set([...officialPaths, ...distinctBackdropPaths])];
}

/** 영화ID로 영화 상세 정보(영화 제목, 이미지 캐러셀, 관람평점, 관람평)를 조회한다 */
export async function fetchMovieDetail(movieId: number): Promise<MovieDetail> {
  const [detail, images, reviews] = await Promise.all([
    requestTmdb<TmdbMovieDetailResult>(`/movie/${movieId}?language=ko-KR`),
    requestTmdb<{ backdrops: TmdbMovieImageResult[]; posters: TmdbMovieImageResult[] }>(
      `/movie/${movieId}/images`
    ),
    requestTmdb<{ results: TmdbMovieReviewResult[] }>(`/movie/${movieId}/reviews?language=ko-KR&page=1`),
  ]);

  return {
    id: detail.id,
    title: detail.title,
    voteAverage: detail.vote_average,
    images: buildCarouselImagePaths(detail, images.backdrops).map((filePath) => ({ filePath })),
    reviews: reviews.results.map((review) => ({
      id: review.id,
      author: review.author,
      content: review.content,
    })),
  };
}
