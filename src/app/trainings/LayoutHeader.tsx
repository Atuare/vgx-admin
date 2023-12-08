"use client";
import { ArrowBack } from "@/assets/Icons";
import { AdmProfile } from "@/components/AdmProfile";
import { useGetTrainingByIdQuery } from "@/services/api/fetchApi";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Layout.module.scss";

export function LayoutHeader() {
  const pathname = usePathname();
  const { back } = useRouter();

  const trainingId = pathname.split("/")[2];

  const { data } = useGetTrainingByIdQuery({ id: trainingId });

  return (
    <header className={styles.training__header}>
      <div className={styles.header__title}>
        {pathname !== "/trainings" && (
          <button onClick={() => back()}>
            <ArrowBack />
          </button>
        )}
        <h1>
          {pathname.endsWith("/edit")
            ? "Editar treinamento"
            : pathname === "/trainings/create"
              ? "Novo treinamento"
              : pathname === "/trainings"
                ? "Treinamentos"
                : data
                  ? `${data.data.trainingName} - ${data.data.productName}`
                  : "Treinamentos"}
        </h1>
      </div>
      <AdmProfile />
    </header>
  );
}
