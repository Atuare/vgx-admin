"use client";
import { ArrowBack } from "@/assets/Icons";
import { AdmProfile } from "@/components/AdmProfile";
import "@/styles/scrollbar.scss";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import styles from "./Layout.module.scss";

const titles = {
  "/trainings": "Treinamentos",
  "/training/create": "Criar treinamento",
  "/training/edit": "Editar treinamento",
};

export default function TrainingLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { back } = useRouter();

  return (
    <div className={styles.training}>
      <header className={styles.training__header}>
        <div className={styles.header__title}>
          {pathname !== "/trainings" && (
            <button onClick={() => back()}>
              <ArrowBack />
            </button>
          )}
          <h1>
            {(pathname.endsWith("/edit") && "Editar treinamento") ||
              titles[pathname as keyof typeof titles] ||
              "Dados do treinamento"}
          </h1>
        </div>
        <AdmProfile />
      </header>
      {children}
    </div>
  );
}
