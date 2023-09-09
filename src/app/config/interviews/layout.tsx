import { AdmProfile } from "@/components/AdmProfile";
import styles from "@/styles/layout.module.scss";
import "@/styles/scrollbar.scss";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "VGX - Configurações Entrevistas",
  description: "VGX - Configurações Entrevistas",
};

export default function InterviewsConfigLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={styles.container}>
      <header className={styles.container__header}>
        <div className={styles.header__title}>
          <h1>Configurações - Agendamentos de entrevista</h1>
        </div>
        <AdmProfile />
      </header>
      {children}
    </div>
  );
}
