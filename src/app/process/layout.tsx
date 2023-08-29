"use client";
import { ArrowBack } from "@/assets/Icons";
import { AdmProfile } from "@/components/AdmProfile";
import "@/styles/scrollbar.scss";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import styles from "./Layout.module.scss";

const titles = {
  "/process": "Processos",
  "/process/create": "Criar processo",
  "/process/edit": "Editar processo",
};

export default function ProcessLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { back } = useRouter();

  return (
    <div className={styles.process}>
      <header className={styles.process__header}>
        <div className={styles.header__title}>
          {pathname !== "/process" && (
            <button onClick={() => back()}>
              <ArrowBack />
            </button>
          )}
          <h1>
            {(pathname.endsWith("/edit") && "Editar processo") ||
              titles[pathname as keyof typeof titles] ||
              "Dados do processo"}
          </h1>
        </div>
        <AdmProfile />
      </header>
      {children}
    </div>
  );
}
