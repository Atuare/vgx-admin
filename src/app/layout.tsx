"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import "./globals.scss";
import type { Metadata } from "next";
import { Sora, Roboto } from "next/font/google";
import { Menu } from "@/components/Menu";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sora",
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Portal Admin",
  description: "VGX - Portal Admin",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="pt-br">
      <body
        className={`${roboto.variable} ${sora.variable} `}
        style={{ display: pathname !== "/login" ? "flex" : "inherit" }}
      >
        {pathname !== "/login" && <Menu />}
        {children}
      </body>
    </html>
  );
}
