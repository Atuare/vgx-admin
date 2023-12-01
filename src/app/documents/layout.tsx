import styles from "@/styles/layout.module.scss";
import "@/styles/scrollbar.scss";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Header } from "./LayoutHeader";

export const metadata: Metadata = {
  title: "VGX - Documentos",
  description: "VGX - Documentos",
};

export default function DocumentsLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <Header />
      {children}
    </div>
  );
}
