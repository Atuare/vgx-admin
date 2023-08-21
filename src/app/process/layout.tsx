"use client";
import { ArrowBack } from "@/assets/Icons";
import Avatar from "@/assets/avatar.png";
import { AdmProfile } from "@/components/AdmProfile";
import useUser from "@/hooks/useUser";
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

  const { user } = useUser();

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
            {titles[pathname as keyof typeof titles] || "Dados do processo"}
          </h1>
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
