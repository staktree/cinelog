import { render, screen } from "@testing-library/react";

import Header from "./Header";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// 메뉴바가 다시 좌측 정렬 등으로 회귀하는 것을 막기 위한 테스트.
// Header.tsx 상단 주석 참고: 메뉴바는 항상 화면 정중앙에 위치해야 한다 (와이어프레임 기준).
describe("Header", () => {
  it("메뉴바가 좌(로고)/우(계정영역) 열 너비가 같은 3열 그리드 구조로 중앙에 위치한다", () => {
    render(<Header userEmail={null} />);

    const headerBar = screen.getByTestId("app-header-bar");
    expect(headerBar.className).toContain("sm:grid-cols-[1fr_auto_1fr]");

    const nav = screen.getByRole("navigation");
    expect(nav.className).toContain("justify-center");
  });

  it("메뉴 항목(감상평/영화 정보 확인하기)이 모두 표시된다", () => {
    render(<Header userEmail={null} />);

    expect(screen.getByText("감상평")).toBeInTheDocument();
    expect(screen.getByText("영화 정보 확인하기")).toBeInTheDocument();
  });
});
