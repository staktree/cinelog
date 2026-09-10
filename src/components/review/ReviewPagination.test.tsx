import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ReviewPagination from "./ReviewPagination";

describe("ReviewPagination", () => {
  it("전체 개수가 페이지 크기 이하이면 아무것도 렌더링하지 않는다", () => {
    const { container } = render(
      <ReviewPagination page={1} totalCount={10} pageSize={20} onPageChange={jest.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("페이지 번호를 클릭하면 onPageChange를 호출한다", async () => {
    const user = userEvent.setup();
    const handlePageChange = jest.fn();
    render(
      <ReviewPagination page={1} totalCount={45} pageSize={20} onPageChange={handlePageChange} />,
    );

    await user.click(screen.getByText("2"));

    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it("첫 페이지에서는 이전 버튼이 비활성화된다", () => {
    render(<ReviewPagination page={1} totalCount={45} pageSize={20} onPageChange={jest.fn()} />);

    expect(screen.getByText("이전")).toBeDisabled();
  });

  it("마지막 페이지에서는 다음 버튼이 비활성화된다", () => {
    render(<ReviewPagination page={3} totalCount={45} pageSize={20} onPageChange={jest.fn()} />);

    expect(screen.getByText("다음")).toBeDisabled();
  });
});
