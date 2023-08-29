"use client";
import { AdmProfile } from "@/components/AdmProfile";
import "@/styles/scrollbar.scss";
import { ReactNode } from "react";
import styles from "./Layout.module.scss";

export default function CandidatesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={styles.candidates}>
      <header className={styles.candidates__header}>
        <div className={styles.header__title}>
          <h1>Candidatos</h1>
        </div>
        <AdmProfile />
      </header>
      {children}
    </div>
  );
}
