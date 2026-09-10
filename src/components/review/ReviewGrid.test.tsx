import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { Review } from "@/types/review";

import ReviewGrid from "./ReviewGrid";

function createReview(overrides: Partial<Review> = {}): Review {
  return {
    id: "26082400001",
    title: "인터스텔라",
    rating: 4.5,
    content: "시간과 사랑에 대한 이야기가 인상적이었다.",
    oneLiner: "우주보다 넓은 사랑 이야기",
    createdAt: "2026-08-24",
    ...overrides,
  };
}

describe("ReviewGrid", () => {
  it("감상평이 없으면 안내 문구를 표시한다", () => {
    render(<ReviewGrid reviews={[]} onSelect={jest.fn()} />);

    expect(screen.getByText("조건에 맞는 감상평이 없습니다.")).toBeInTheDocument();
  });

  it("감상평 목록을 제목/평점/작성일자로 표시한다", () => {
    const review = createReview();
    render(<ReviewGrid reviews={[review]} onSelect={jest.fn()} />);

    expect(screen.getByText("인터스텔라")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("2026-08-24")).toBeInTheDocument();
  });

  it("행을 클릭하면 해당 감상평ID로 onSelect를 호출한다", async () => {
    const user = userEvent.setup();
    const handleSelect = jest.fn();
    const review = createReview();
    render(<ReviewGrid reviews={[review]} onSelect={handleSelect} />);

    await user.click(screen.getByText("인터스텔라"));

    expect(handleSelect).toHaveBeenCalledWith("26082400001");
  });
});
