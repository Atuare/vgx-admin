"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { usePathname } from "next/navigation";
import "./globals.scss";
import type { Metadata } from "next";
import { Sora, Roboto, Inter } from "next/font/google";
import { Menu } from "@/components/Menu";
import { store } from "@/store/store";
import ProtectedRoute from "@/components/ProtectedRoute";

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
const inter = Inter({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Portal Admin",
  description: "VGX - Portal Admin",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="pt-br">
      <Provider store={store}>
        <body
          className={`${inter.variable} ${roboto.variable} ${sora.variable} `}
          style={{ display: pathname !== "/login" ? "flex" : "inherit" }}
        >
          <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            {pathname !== "/login" && <Menu />}
            {children}
          </ProtectedRoute>
        </body>
      </Provider>
    </html>
  );
}
