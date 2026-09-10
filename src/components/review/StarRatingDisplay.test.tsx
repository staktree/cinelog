import { render, screen } from "@testing-library/react";

import StarRatingDisplay from "./StarRatingDisplay";

describe("StarRatingDisplay", () => {
  it("평점 숫자를 소수점 첫째 자리까지 표시한다", () => {
    render(<StarRatingDisplay value={4.5} />);

    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("평점 라벨을 접근성 속성으로 노출한다", () => {
    render(<StarRatingDisplay value={3} />);

    expect(screen.getByLabelText("평점 3.0점")).toBeInTheDocument();
  });
});
