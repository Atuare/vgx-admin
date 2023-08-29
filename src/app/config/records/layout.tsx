"use client";
import { AdmProfile } from "@/components/AdmProfile";
import styles from "@/styles/layout.module.scss";
import "@/styles/scrollbar.scss";
import { ReactNode } from "react";

export default function RecordsLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <header className={styles.container__header}>
        <div className={styles.header__title}>
          <h1>Configurações - Cadastros</h1>
        </div>
        <AdmProfile />
      </header>
      {children}
    </div>
  );
}
