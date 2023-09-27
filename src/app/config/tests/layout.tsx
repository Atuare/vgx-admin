import { AdmProfile } from "@/components/AdmProfile";
import styles from "@/styles/layout.module.scss";
import "@/styles/scrollbar.scss";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { LayoutHeader } from "./LayoutHeader";

export const metadata: Metadata = {
  title: "VGX - Configurações Provas",
  description: "VGX - Configurações Provas",
};

export default function TestsConfigLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={styles.container}>
      <header className={styles.container__header}>
        <LayoutHeader />
        <AdmProfile />
      </header>
      {children}
    </div>
  );
}
