import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "myRoom | JCJ Portfolio",
  description: "Next.js + Three.js로 구현한 3D 인터랙티브 포트폴리오. 가상의 방을 직접 탐색하며 포트폴리오를 경험하세요.",
  keywords: ["portfolio", "3D", "Three.js", "Next.js", "interactive", "JCJ", "정철진"],
  authors: [{ name: "JCJ", url: "https://github.com/cjfwls39" }],
  openGraph: {
    title: "myRoom | JCJ Portfolio",
    description: "Next.js + Three.js로 구현한 3D 인터랙티브 포트폴리오.",
    url: "https://github.com/cjfwls39/myRoom", //나중에 호스팅하면 여기 호스팅 주소로 변경
    siteName: "myRoom",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
