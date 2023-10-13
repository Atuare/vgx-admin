"use client";
import { ArrowBack } from "@/assets/Icons";
import { AdmProfile } from "@/components/AdmProfile";
import styles from "@/styles/layout.module.scss";
import { usePathname, useRouter } from "next/navigation";

export function LayoutHeader() {
  const pathname = usePathname();
  const { back } = useRouter();

  const titles = {
    "/exams/create": "Novo exame",
    "/exams": "Exames admissionais",
  };

  return (
    <header className={styles.container__header}>
      <div className={styles.header__title}>
        {pathname !== "/exams" && (
          <button onClick={() => back()} style={{ cursor: "pointer" }}>
            <ArrowBack />
          </button>
        )}
        <h1>{titles[pathname as keyof typeof titles] ?? "Turma detalhes"}</h1>
      </div>
      <AdmProfile />
    </header>
  );
}
