import styles from "@/styles/layout.module.scss";
import "@/styles/scrollbar.scss";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { LayoutHeader } from "./LayouHeader";

export const metadata: Metadata = {
  title: "VGX - Configurações Exames Admissionais",
  description: "VGX - Configurações Exames Admissionais",
};

export default function ExamsLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <LayoutHeader />
      {children}
    </div>
  );
}
