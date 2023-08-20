"use client";
import Avatar from "@/assets/avatar.png";
import { AdmProfile } from "@/components/AdmProfile";
import useUser from "@/hooks/useUser";
import "@/styles/scrollbar.scss";
import { ReactNode } from "react";
import styles from "./Layout.module.scss";

export default function CandidatesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useUser();

  return (
    <div className={styles.candidates}>
      <header className={styles.candidates__header}>
        <div className={styles.header__title}>
          <h1>Candidatos</h1>
        </div>
        <AdmProfile
          image={Avatar}
          name={user?.employee?.name}
          role={user?.profile}
        />
      </header>
      {children}
    </div>
  );
}
