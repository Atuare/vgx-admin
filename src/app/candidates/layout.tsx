import { AdmProfile } from "@/components/AdmProfile";
import "@/styles/scrollbar.scss";
import type { Metadata } from "next";
import { ReactNode } from "react";
import styles from "./Layout.module.scss";

export const metadata: Metadata = {
  title: "VGX - Candidatos",
  description: "VGX - Candidatos",
};

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
