"use client";

/**
 * 공통 헤더 (로고/타이틀 + 메뉴바)
 * - wireframe/화면 구성_감상평 조회.png, wireframe/화면구성_영화정보조회.png 상단 영역 기준
 * - SDD/워크플로우.md 1, 3, 13번 규칙: 메뉴바는 감상평, 영화정보로 구성되며 클릭 시 해당 메뉴로 이동.
 *   로그인 상태에 따라 로그인/로그아웃 상태를 표시한다.
 */

import { useSession } from "@/components/auth/SessionProvider";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export type MenuType = "review" | "movie";

interface AppHeaderProps {
  activeMenu: MenuType;
  onMenuChange: (menu: MenuType) => void;
}

export function AppHeader({ activeMenu, onMenuChange }: AppHeaderProps) {
  const { session } = useSession();

  async function handleLogoutClick() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    // 로그아웃 후 세션이 null로 갱신되면 감상평 메뉴는 자동으로 로그인 화면을 표시한다 (SDD/워크플로우.md 13번 규칙).
  }

  function renderMenuButton(menu: MenuType, label: string) {
    const isActive = activeMenu === menu;

    function handleClick() {
      onMenuChange(menu);
    }

    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={isActive}
        className={`rounded-md border px-4 py-2 text-sm font-medium ${
          isActive ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <header className="grid grid-cols-3 items-center border-b border-gray-200 px-6 py-4">
      <span className="text-lg font-bold">시네로그</span>
      <nav className="flex justify-center gap-2">
        {renderMenuButton("review", "감상평")}
        {renderMenuButton("movie", "영화 정보 확인하기")}
      </nav>
      <div className="flex items-center justify-end gap-2 text-sm text-gray-500">
        {session && (
          <>
            <span className="hidden truncate sm:inline">{session.user.email}</span>
            <button
              type="button"
              onClick={handleLogoutClick}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium"
            >
              로그아웃
            </button>
          </>
        )}
      </div>
    </header>
  );
}
