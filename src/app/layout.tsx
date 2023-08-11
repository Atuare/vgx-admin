"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import "./globals.scss";
import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { Menu } from "@/components/Menu";

const sora = Sora({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "Portal Admin",
  description: "VGX - Portal Admin",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="pt-br">
      <body
        className={sora.className}
        style={{ display: pathname !== "/login" ? "flex" : "inherit" }}
      >
        {pathname !== "/login" && <Menu />}
        {children}
      </body>
    </html>
  );
}
