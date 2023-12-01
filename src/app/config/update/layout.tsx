import { AdmProfile } from "@/components/AdmProfile";
import styles from "@/styles/layout.module.scss";
import "@/styles/scrollbar.scss";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "VGX - Configurações Atualizações de dados",
  description: "VGX - Configurações Atualizações de dados",
};

export default function UpdateConfigLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={styles.container}>
      <header className={styles.container__header}>
        <div className={styles.header__title}>
          <h1>Configurações - Atualizações de Dados</h1>
        </div>
        <AdmProfile />
      </header>
      {children}
    </div>
  );
}
