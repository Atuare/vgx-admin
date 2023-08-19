"use client";
import { ArrowBack } from "@/assets/Icons";
import Avatar from "@/assets/avatar.png";
import { AdmProfile } from "@/components/AdmProfile";
import { ProcessesDataContext } from "@/contexts/ProcessesDataContext";
import useUser from "@/hooks/useUser";
import { ProcessesType } from "@/interfaces/process.interface";
import { useGetAllProcessQuery } from "@/services/api/fetchApi";
import "@/styles/scrollbar.scss";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Layout.module.scss";

const titles = {
  "/process": "Processos",
  "/process/create": "Criar processo",
  "/process/edit": "Editar processo",
};

export default function ProcessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const [processes, setProcesses] = useState<ProcessesType>();
  const { data, isSuccess } = useGetAllProcessQuery({ page: 1, size: 2 });

  const pathname = usePathname();
  const { back } = useRouter();

  useEffect(() => {
    if (isSuccess) {
      setProcesses(data);
    }
  }, [isSuccess]);

  if (!processes) return null;

  return (
    <ProcessesDataContext.Provider
      value={{ processes, setProcesses, defaultTableSize: 2 }}
    >
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
    </ProcessesDataContext.Provider>
  );
}
