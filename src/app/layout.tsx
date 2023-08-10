import { ReactNode } from "react";
import "./globals.scss";
import type { Metadata } from "next";
import { Sora } from "next/font/google";

const sora = Sora({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "Portal Admin",
  description: "VGX - Portal Admin",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={sora.className}>{children}</body>
    </html>
  );
}
