import { AdmProfile } from "@/components/AdmProfile";
import styles from "@/styles/layout.module.scss";
import "@/styles/scrollbar.scss";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "VGX - Configurações Contratos e Admissões",
  description: "VGX - Configurações Contratos e Admissões",
};

export default function ContractsConfigLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={styles.container}>
      <header className={styles.container__header}>
        <div className={styles.header__title}>
          <h1>Configurações - Contratos e Admissões</h1>
        </div>
        <AdmProfile />
      </header>
      {children}
    </div>
  );
}
