import type { MovieDetail, MovieReview, MovieSummary } from "@/types/movie";

import {
  MOVIE_CAROUSEL_IMAGE_LIMIT,
  MOVIE_REVIEW_LIMIT,
  TMDB_BACKDROP_SIZE,
  TMDB_LANGUAGE,
  TMDB_NOW_PLAYING_MAX_PAGE,
  TMDB_POSTER_SIZE,
  TMDB_REGION,
} from "./movieConstants";
import { fetchFromTmdb, toTmdbImageUrl } from "./tmdbClient";

interface TmdbMovieSummaryResponse {
  id: number;
  title: string;
  poster_path: string | null;
}

interface TmdbNowPlayingResponse {
  results: TmdbMovieSummaryResponse[];
  total_pages?: number;
}

interface TmdbMovieDetailResponse {
  id: number;
  title: string;
  vote_average: number;
}

interface TmdbImageResponse {
  backdrops: { file_path: string }[];
}

interface TmdbReviewResponse {
  id: string;
  author: string;
  content: string;
}

interface TmdbReviewListResponse {
  results: TmdbReviewResponse[];
}

/** 오늘 날짜/지역(한국) 기준으로 개봉중인 영화 목록을 조회한다 (모든 페이지를 취합) */
export async function fetchNowPlayingMovies(): Promise<MovieSummary[]> {
  const firstPage = await fetchNowPlayingPage(1);
  const totalPageCount = Math.min(firstPage.total_pages ?? 1, TMDB_NOW_PLAYING_MAX_PAGE);

  const restPages = await Promise.all(
    Array.from({ length: totalPageCount - 1 }, (_unused, index) =>
      fetchNowPlayingPage(index + 2),
    ),
  );

  const allMovies = [firstPage, ...restPages].flatMap((page) => page.results);

  return allMovies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    posterUrl: toTmdbImageUrl(movie.poster_path, TMDB_POSTER_SIZE),
  }));
}

/** TMDB now_playing의 특정 페이지를 조회한다 */
function fetchNowPlayingPage(page: number): Promise<TmdbNowPlayingResponse> {
  return fetchFromTmdb<TmdbNowPlayingResponse>("/movie/now_playing", {
    region: TMDB_REGION,
    language: TMDB_LANGUAGE,
    page: String(page),
  });
}

/** 영화ID로 상세 정보(제목/이미지 캐러셀/관람평점/관람평)를 조회한다 */
export async function fetchMovieDetail(movieId: number): Promise<MovieDetail> {
  const [detail, images, reviews] = await Promise.all([
    fetchFromTmdb<TmdbMovieDetailResponse>(`/movie/${movieId}`, { language: TMDB_LANGUAGE }),
    fetchFromTmdb<TmdbImageResponse>(`/movie/${movieId}/images`),
    fetchFromTmdb<TmdbReviewListResponse>(`/movie/${movieId}/reviews`, {
      language: TMDB_LANGUAGE,
    }),
  ]);

  return {
    id: detail.id,
    title: detail.title,
    imageUrls: mapImageUrls(images.backdrops),
    voteAverage: detail.vote_average,
    reviews: mapReviews(reviews.results),
  };
}

/** TMDB 백드롭 이미지 목록을 캐러셀용 이미지 URL 목록으로 변환한다 (최대 개수 제한) */
function mapImageUrls(backdrops: { file_path: string }[]): string[] {
  return backdrops
    .slice(0, MOVIE_CAROUSEL_IMAGE_LIMIT)
    .map((backdrop) => toTmdbImageUrl(backdrop.file_path, TMDB_BACKDROP_SIZE))
    .filter((url): url is string => url !== null);
}

/** TMDB 리뷰 응답을 관람평 도메인 모델로 변환한다 (최대 개수 제한) */
function mapReviews(rawReviews: TmdbReviewResponse[]): MovieReview[] {
  return rawReviews.slice(0, MOVIE_REVIEW_LIMIT).map((review) => ({
    id: review.id,
    author: review.author,
    content: review.content,
  }));
}
