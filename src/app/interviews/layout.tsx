"use client";
import Placeholder from "@/assets/placeholder.png";
import { AdmProfile } from "@/components/AdmProfile";
import useUser from "@/hooks/useUser";
import styles from "@/styles/layout.module.scss";
import "@/styles/scrollbar.scss";
import { ReactNode } from "react";

export default function InterviewsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useUser();

  return (
    <div className={styles.container}>
      <header className={styles.container__header}>
        <div className={styles.header__title}>
          <h1>Entrevistas</h1>
        </div>
        <AdmProfile
          image={user?.employee?.image ? user?.employee.image : Placeholder}
          name={user?.employee?.name}
          role={user?.profile}
        />
      </header>
      {children}
    </div>
  );
}
