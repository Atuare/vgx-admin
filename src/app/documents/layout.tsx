"use client";
import Avatar from "@/assets/avatar.png";
import { AdmProfile } from "@/components/AdmProfile";
import useUser from "@/hooks/useUser";
import "@/styles/scrollbar.scss";
import { ReactNode } from "react";
import styles from "./Layout.module.scss";

export default function DocumentsLayout({ children }: { children: ReactNode }) {
  const { user } = useUser();

  return (
    <div className={styles.documents}>
      <header className={styles.documents__header}>
        <div className={styles.header__title}>
          <h1>Documentos</h1>
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
