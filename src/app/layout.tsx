import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Header from "@/components/layout/Header";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "시네로그",
  description: "영화의 감상평을 작성하여 보관할 수 있는 웹 페이지 서비스",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-50">
        <Header userEmail={user?.email ?? null} />
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
