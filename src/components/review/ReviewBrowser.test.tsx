import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import * as reviewActions from "@/app/actions/reviewActions";
import type { Review } from "@/types/review";

import ReviewBrowser from "./ReviewBrowser";

jest.mock("@/app/actions/reviewActions");

const mockedActions = reviewActions as jest.Mocked<typeof reviewActions>;

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

describe("ReviewBrowser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Grid에서 감상평을 선택하면 상세 팝업이 열린다", async () => {
    const user = userEvent.setup();
    const review = createReview();
    mockedActions.getReviewAction.mockResolvedValue({ success: true, data: review });

    render(
      <ReviewBrowser
        initialResult={{ items: [review], totalCount: 1, page: 1, pageSize: 20 }}
      />,
    );

    await user.click(screen.getByText("인터스텔라"));

    expect(await screen.findByText("우주보다 넓은 사랑 이야기")).toBeInTheDocument();
    expect(mockedActions.getReviewAction).toHaveBeenCalledWith("26082400001");
  });

  it("새 감상평 작성 후 저장하면 팝업이 닫히고 목록이 다시 조회된다", async () => {
    const user = userEvent.setup();
    const created = createReview({ id: "26082400002", title: "새 영화" });
    mockedActions.createReviewAction.mockResolvedValue({ success: true, data: created });
    mockedActions.listReviewsAction.mockResolvedValue({
      items: [created],
      totalCount: 1,
      page: 1,
      pageSize: 20,
    });

    render(<ReviewBrowser initialResult={{ items: [], totalCount: 0, page: 1, pageSize: 20 }} />);

    await user.click(screen.getByText("새 감상평 작성하기"));
    await user.type(screen.getByPlaceholderText("영화 제목을 입력해주세요"), "새 영화");
    await user.type(screen.getByPlaceholderText("감상평을 입력해주세요"), "좋았다.");
    await user.type(screen.getByPlaceholderText("한줄평을 입력해주세요"), "좋았음");
    await user.click(screen.getByText("저장하기"));

    await waitFor(() => {
      expect(screen.queryByText("감상평 작성")).not.toBeInTheDocument();
    });
    expect(mockedActions.listReviewsAction).toHaveBeenCalled();
  });

  it("상세 팝업의 편집하기를 누르면 수정 폼으로 전환되고 저장 시 반영된다", async () => {
    const user = userEvent.setup();
    const review = createReview();
    const updated = createReview({ title: "수정된 제목" });
    mockedActions.getReviewAction.mockResolvedValue({ success: true, data: review });
    mockedActions.updateReviewAction.mockResolvedValue({ success: true, data: updated });
    mockedActions.listReviewsAction.mockResolvedValue({
      items: [updated],
      totalCount: 1,
      page: 1,
      pageSize: 20,
    });

    render(
      <ReviewBrowser
        initialResult={{ items: [review], totalCount: 1, page: 1, pageSize: 20 }}
      />,
    );

    await user.click(screen.getByText("인터스텔라"));
    await user.click(await screen.findByText("편집하기"));

    const titleInput = await screen.findByDisplayValue("인터스텔라");
    await user.clear(titleInput);
    await user.type(titleInput, "수정된 제목");
    await user.click(screen.getByText("저장하기"));

    await waitFor(() => {
      expect(mockedActions.updateReviewAction).toHaveBeenCalledWith(
        "26082400001",
        expect.objectContaining({ title: "수정된 제목" }),
      );
    });
    expect(await screen.findByRole("heading", { name: "수정된 제목" })).toBeInTheDocument();
  });
});
