"use client";
import { ArrowBack } from "@/assets/Icons";
import { AdmProfile } from "@/components/AdmProfile";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Layout.module.scss";

const titles = {
  "/trainings": "Treinamentos",
  "/training/create": "Criar treinamento",
  "/training/edit": "Editar treinamento",
};

export function LayoutHeader() {
  const pathname = usePathname();
  const { back } = useRouter();

  return (
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
  );
}
