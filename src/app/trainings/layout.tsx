import "@/styles/scrollbar.scss";
import type { Metadata } from "next";
import { ReactNode } from "react";
import styles from "./Layout.module.scss";
import { LayoutHeader } from "./LayoutHeader";

export const metadata: Metadata = {
  title: "VGX - Treinamentos",
  description: "VGX - Treinamentos",
};

export default function TrainingLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.training}>
      <LayoutHeader />
      {children}
    </div>
  );
}
