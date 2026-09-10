import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import * as movieActions from "@/app/actions/movieActions";
import type { MovieDetail, MovieSummary } from "@/types/movie";

import MovieBrowser from "./MovieBrowser";

jest.mock("@/app/actions/movieActions");

const mockedActions = movieActions as jest.Mocked<typeof movieActions>;

function createMovie(overrides: Partial<MovieSummary> = {}): MovieSummary {
  return {
    id: 1,
    title: "인터스텔라",
    posterUrl: "https://image.tmdb.org/t/p/w342/poster.jpg",
    ...overrides,
  };
}

function createDetail(overrides: Partial<MovieDetail> = {}): MovieDetail {
  return {
    id: 1,
    title: "인터스텔라",
    imageUrls: ["https://image.tmdb.org/t/p/w780/a.jpg"],
    voteAverage: 8.4,
    reviews: [{ id: "r1", author: "홍길동", content: "인생 영화입니다." }],
    ...overrides,
  };
}

describe("MovieBrowser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("목록 조회에 실패하면 에러 메시지를 표시한다", () => {
    render(
      <MovieBrowser
        initialResult={{ success: false, error: { code: "EXTERNAL_API_ERROR", message: "조회 실패" } }}
      />,
    );

    expect(screen.getByText("조회 실패")).toBeInTheDocument();
    expect(screen.getByText("개봉중인 영화가 없습니다.")).toBeInTheDocument();
  });

  it("카드를 클릭하면 상세 팝업이 열린다", async () => {
    const user = userEvent.setup();
    const movie = createMovie();
    const detail = createDetail();
    mockedActions.getMovieDetailAction.mockResolvedValue({ success: true, data: detail });

    render(<MovieBrowser initialResult={{ success: true, data: [movie] }} />);

    await user.click(screen.getByText("인터스텔라"));

    expect(await screen.findByText("관람평점 8.4 / 10")).toBeInTheDocument();
    expect(mockedActions.getMovieDetailAction).toHaveBeenCalledWith(1);
  });

  it("상세 조회에 실패하면 에러 메시지를 표시한다", async () => {
    const user = userEvent.setup();
    const movie = createMovie();
    mockedActions.getMovieDetailAction.mockResolvedValue({
      success: false,
      error: { code: "EXTERNAL_API_ERROR", message: "상세 조회 실패" },
    });

    render(<MovieBrowser initialResult={{ success: true, data: [movie] }} />);

    await user.click(screen.getByText("인터스텔라"));

    expect(await screen.findByText("상세 조회 실패")).toBeInTheDocument();
  });
});
