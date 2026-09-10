import { ExternalApiError } from "@/lib/errors/ExternalApiError";

import { fetchMovieDetail, fetchNowPlayingMovies } from "./movieRepository";

function jsonResponse(body: unknown, ok = true): Response {
  return {
    ok,
    status: ok ? 200 : 500,
    json: async () => body,
  } as Response;
}

describe("movieRepository", () => {
  const originalFetch = global.fetch;
  const originalApiKey = process.env.TMDB_API_KEY;

  beforeEach(() => {
    process.env.TMDB_API_KEY = "test-api-key";
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.TMDB_API_KEY = originalApiKey;
  });

  it("개봉중인 영화 목록을 포스터 URL과 함께 반환한다", async () => {
    global.fetch = jest.fn().mockResolvedValue(
      jsonResponse({
        results: [{ id: 1, title: "인터스텔라", poster_path: "/poster.jpg" }],
      }),
    );

    const movies = await fetchNowPlayingMovies();

    expect(movies).toEqual([
      {
        id: 1,
        title: "인터스텔라",
        posterUrl: "https://image.tmdb.org/t/p/w342/poster.jpg",
      },
    ]);
  });

  it("포스터 이미지가 없으면 posterUrl은 null이다", async () => {
    global.fetch = jest.fn().mockResolvedValue(
      jsonResponse({ results: [{ id: 1, title: "인터스텔라", poster_path: null }] }),
    );

    const movies = await fetchNowPlayingMovies();

    expect(movies[0].posterUrl).toBeNull();
  });

  it("total_pages가 2 이상이면 모든 페이지의 영화를 취합해서 반환한다", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({
          results: [{ id: 1, title: "1페이지 영화", poster_path: "/a.jpg" }],
          total_pages: 2,
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          results: [{ id: 2, title: "싱 어게인", poster_path: "/b.jpg" }],
          total_pages: 2,
        }),
      );

    const movies = await fetchNowPlayingMovies();

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(movies.map((movie) => movie.title)).toEqual(["1페이지 영화", "싱 어게인"]);
  });

  it("TMDB API 호출이 실패하면 ExternalApiError를 던진다", async () => {
    global.fetch = jest.fn().mockResolvedValue(jsonResponse({}, false));

    await expect(fetchNowPlayingMovies()).rejects.toThrow(ExternalApiError);
  });

  it("영화 상세 정보를 제목/이미지/관람평점/관람평으로 구성한다", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(jsonResponse({ id: 1, title: "인터스텔라", vote_average: 8.4 }))
      .mockResolvedValueOnce(
        jsonResponse({ backdrops: [{ file_path: "/a.jpg" }, { file_path: "/b.jpg" }] }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ results: [{ id: "r1", author: "홍길동", content: "인생 영화입니다." }] }),
      );

    const detail = await fetchMovieDetail(1);

    expect(detail).toEqual({
      id: 1,
      title: "인터스텔라",
      imageUrls: [
        "https://image.tmdb.org/t/p/w780/a.jpg",
        "https://image.tmdb.org/t/p/w780/b.jpg",
      ],
      voteAverage: 8.4,
      reviews: [{ id: "r1", author: "홍길동", content: "인생 영화입니다." }],
    });
  });

  it("TMDB_API_KEY가 없으면 ExternalApiError를 던진다", async () => {
    delete process.env.TMDB_API_KEY;
    global.fetch = jest.fn();

    await expect(fetchNowPlayingMovies()).rejects.toThrow(ExternalApiError);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
