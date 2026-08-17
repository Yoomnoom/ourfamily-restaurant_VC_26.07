import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "우리집식당",
  description: "묻지 않아도 아는 우리집 식사 조율"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
