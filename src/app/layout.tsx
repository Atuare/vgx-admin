import "@/styles/scrollbar.scss";
import type { Metadata } from "next";

import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RootLayoutProvider } from "./RootLayoutProvider";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Portal Admin",
  description: "VGX - Portal Admin",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <RootLayoutProvider>
        {children} <ToastContainer />
      </RootLayoutProvider>
    </html>
  );
}
