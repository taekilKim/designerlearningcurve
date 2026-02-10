import type { Metadata } from "next";
import "./globals.css";
import { GNB } from "@/components/shared/gnb";
import { BottomNav } from "@/components/shared/bottom-nav";
import { Toaster } from "@/components/ui/sonner";
import { PreventZoom } from "@/components/shared/prevent-zoom";

const SITE_URL = "https://designpath.vercel.app";
const SITE_NAME = "Designer Learning Curve";
const SITE_DESC = "디자이너를 위한 아티클 큐레이션 & 커리큘럼 학습 플랫폼";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  keywords: ["UX 디자인", "UI 디자인", "디자인 시스템", "프로덕트 디자인", "UX 리서치", "디자이너 학습", "디자인 아티클"],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESC,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="antialiased">
        <PreventZoom />
        <GNB />
        <main className="min-h-screen pb-16 md:pb-0">{children}</main>
        <BottomNav />
        <Toaster />
      </body>
    </html>
  );
}
