"use client";
import Avatar from "@/assets/avatar.png";
import { AdmProfile } from "@/components/AdmProfile";
import useUser from "@/hooks/useUser";
import styles from "@/styles/layout.module.scss";
import "@/styles/scrollbar.scss";
import { ReactNode } from "react";

export default function RecordsLayout({ children }: { children: ReactNode }) {
  const { user } = useUser();

  return (
    <div className={styles.container}>
      <header className={styles.container__header}>
        <div className={styles.header__title}>
          <h1>Configurações - Cadastros</h1>
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
