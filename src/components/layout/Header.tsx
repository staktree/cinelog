"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOutAction } from "@/app/actions/authActions";

interface MenuItem {
  href: string;
  label: string;
}

interface HeaderProps {
  /** 로그인한 사용자의 이메일. 로그인하지 않았으면 null */
  userEmail: string | null;
}

const MENU_ITEMS: MenuItem[] = [
  { href: "/", label: "감상평" },
  { href: "/movies", label: "영화 정보 확인하기" },
];

/** 로고/타이틀과 메뉴바로 구성된 상단 헤더 (와이어프레임: 화면구성_영화정보조회.png) */
export default function Header({ userEmail }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
        <span className="text-lg font-bold text-zinc-900">시네로그</span>
        <nav className="flex items-center gap-4">
          {MENU_ITEMS.map((item) => (
            <MenuLink key={item.href} item={item} isActive={pathname === item.href} />
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {userEmail ? (
            <>
              <span className="hidden text-sm text-zinc-500 sm:inline">{userEmail}</span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 hover:border-zinc-400"
                >
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 hover:border-zinc-400"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

interface MenuLinkProps {
  item: MenuItem;
  isActive: boolean;
}

/** 메뉴바의 각 메뉴 항목 (현재 화면에 해당하는 메뉴를 강조 표시한다) */
function MenuLink({ item, isActive }: MenuLinkProps) {
  return (
    <Link
      href={item.href}
      className={
        isActive
          ? "rounded-full border border-zinc-900 bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white"
          : "rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 hover:border-zinc-400"
      }
    >
      {item.label}
    </Link>
  );
}
