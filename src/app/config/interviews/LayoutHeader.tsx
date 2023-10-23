"use client";
import { ArrowBack } from "@/assets/Icons";
import { AdmProfile } from "@/components/AdmProfile";
import styles from "@/styles/layout.module.scss";

import { useParams, usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

export function LayoutHeader({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const { back } = useRouter();

  const title =
    pathname === "/config/interviews"
      ? "Configurações - Agendamentos de entrevista"
      : params.id && Array.from(params.id).join("")
      ? "Editar Agendamento"
      : "Novo Agendamento";

  return (
    <div className={styles.container}>
      <header className={styles.container__header}>
        <div className={styles.header__title}>
          {pathname !== "/config/interviews" && (
            <button onClick={() => back()}>
              <ArrowBack />
            </button>
          )}
          <h1>{title}</h1>
        </div>
        <AdmProfile />
      </header>
      {children}
    </div>
  );
}
