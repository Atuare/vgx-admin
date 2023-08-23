"use client";

import { Menu } from "@/components/Menu";
import ProtectedRoute from "@/components/ProtectedRoute";
import { store } from "@/store/store";
import "@/styles/scrollbar.scss";
import type { Metadata } from "next";
import { Inter, Roboto, Sora } from "next/font/google";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import "./globals.scss";

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
