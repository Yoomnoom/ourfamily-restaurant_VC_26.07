import type { Metadata } from "next";
import { Noto_Serif_KR, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "우리집식당",
  description: "묻지 않아도 아는 우리집 식사 조율"
};

const serif = Noto_Serif_KR({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-serif" });
const sans = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans" });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
