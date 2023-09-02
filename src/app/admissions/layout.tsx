import "@/styles/scrollbar.scss";
import type { Metadata } from "next";
import { ReactNode } from "react";
import styles from "./Layout.module.scss";
import { Header } from "./LayoutHeader";

export const metadata: Metadata = {
  title: "VGX - Admissões",
  description: "VGX - Admissões",
};

export default function AdmissionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={styles.admissions}>
      <Header />
      {children}
    </div>
  );
}
