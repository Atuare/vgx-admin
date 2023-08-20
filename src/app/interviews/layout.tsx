"use client";
import Avatar from "@/assets/avatar.png";
import { AdmProfile } from "@/components/AdmProfile";
import useUser from "@/hooks/useUser";
import "@/styles/scrollbar.scss";
import { ReactNode } from "react";
import styles from "./Layout.module.scss";

export default function InterviewsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useUser();

  return (
    <div className={styles.interviews}>
      <header className={styles.interviews__header}>
        <div className={styles.header__title}>
          <h1>Entrevistas</h1>
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
