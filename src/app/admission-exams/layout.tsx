"use client";
import { AdmProfile } from "@/components/AdmProfile";
import "@/styles/scrollbar.scss";
import { ReactNode } from "react";
import styles from "./Layout.module.scss";

export default function AdmissionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={styles.admissions}>
      <header className={styles.admissions__header}>
        <div className={styles.header__title}>
          <h1>Admissões</h1>
        </div>
        <AdmProfile />
      </header>
      {children}
    </div>
  );
}
