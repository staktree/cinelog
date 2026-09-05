"use client";

/**
 * 메인 화면 (로고/메뉴바 + 메인화면 영역)
 * - SDD/워크플로우.md 1~3번 규칙: 메뉴바(감상평/영화정보) 전환, 초기 접속 시 감상평 조회 메뉴 Default
 */

import { useState } from "react";

import { AppHeader, type MenuType } from "@/components/layout/AppHeader";
import { MovieInfoScreen } from "@/components/movies/MovieInfoScreen";
import { ReviewScreen } from "@/components/reviews/ReviewScreen";

export default function MainPage() {
  const [activeMenu, setActiveMenu] = useState<MenuType>("review");

  return (
    <div>
      <AppHeader activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      {activeMenu === "review" ? <ReviewScreen /> : <MovieInfoScreen />}
    </div>
  );
}
