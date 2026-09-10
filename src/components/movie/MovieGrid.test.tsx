import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { MovieSummary } from "@/types/movie";

import MovieGrid from "./MovieGrid";

function createMovie(overrides: Partial<MovieSummary> = {}): MovieSummary {
  return {
    id: 1,
    title: "인터스텔라",
    posterUrl: "https://image.tmdb.org/t/p/w342/poster.jpg",
    ...overrides,
  };
}

describe("MovieGrid", () => {
  it("개봉중인 영화가 없으면 안내 문구를 표시한다", () => {
    render(<MovieGrid movies={[]} onSelect={jest.fn()} />);

    expect(screen.getByText("개봉중인 영화가 없습니다.")).toBeInTheDocument();
  });

  it("영화 목록을 포스터/제목 카드로 표시한다", () => {
    const movie = createMovie();
    render(<MovieGrid movies={[movie]} onSelect={jest.fn()} />);

    expect(screen.getByText("인터스텔라")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "인터스텔라" })).toBeInTheDocument();
  });

  it("포스터가 없으면 안내 문구를 표시한다", () => {
    render(<MovieGrid movies={[createMovie({ posterUrl: null })]} onSelect={jest.fn()} />);

    expect(screen.getByText("포스터 없음")).toBeInTheDocument();
  });

  it("카드를 클릭하면 해당 영화ID로 onSelect를 호출한다", async () => {
    const user = userEvent.setup();
    const handleSelect = jest.fn();
    render(<MovieGrid movies={[createMovie()]} onSelect={handleSelect} />);

    await user.click(screen.getByText("인터스텔라"));

    expect(handleSelect).toHaveBeenCalledWith(1);
  });
});
