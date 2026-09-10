import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ReviewSearchBar from "./ReviewSearchBar";

describe("ReviewSearchBar", () => {
  it("조회 버튼을 클릭하면 입력한 조건으로 onSearch를 호출한다", async () => {
    const user = userEvent.setup();
    const handleSearch = jest.fn();
    render(
      <ReviewSearchBar initialCondition={{ title: "", createdAt: "" }} onSearch={handleSearch} />,
    );

    await user.type(screen.getByPlaceholderText("제목으로 조회"), "인터스텔라");
    await user.click(screen.getByText("조회"));

    expect(handleSearch).toHaveBeenCalledWith({ title: "인터스텔라", createdAt: "" });
  });
});
