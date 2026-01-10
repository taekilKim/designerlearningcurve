import type { Metadata } from "next";
import "./globals.css";
import { GNB } from "@/components/shared/gnb";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Designer Learning Curve",
  description: "아티클을 순서 있는 커리큘럼으로 제공하여 학습 완주를 돕는 웹 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="antialiased">
        <GNB />
        <main className="min-h-screen">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
