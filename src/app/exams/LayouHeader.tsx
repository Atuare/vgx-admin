"use client";
import { ArrowBack } from "@/assets/Icons";
import { AdmProfile } from "@/components/AdmProfile";
import useExam from "@/hooks/useExam";
import styles from "@/styles/layout.module.scss";
import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";

export function LayoutHeader() {
  const pathname = usePathname();
  const { back } = useRouter();

  const { exam } = useExam();

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
        <h1>
          {titles[pathname as keyof typeof titles] ??
            (exam &&
              `${exam?.location} - ${dayjs(exam?.startDate).format(
                "DD/MM/YYYY",
              )} ${exam?.time && dayjs(exam?.time).format("HH:mm")}`)}
        </h1>
      </div>
      <AdmProfile />
    </header>
  );
}
