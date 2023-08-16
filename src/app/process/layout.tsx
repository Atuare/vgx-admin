"use client";
import styles from "./Layout.module.scss";
import "@/styles/scrollbar.scss";
import { AdmProfile } from "@/components/AdmProfile";
import Avatar from "@/assets/avatar.png";
import { usePathname, useRouter } from "next/navigation";
import { ArrowBack } from "@/assets/Icons";
import { useEffect, useState } from "react";
import { ProcessesType } from "@/@types/Process";
import { ProcessesDataContext } from "@/contexts/ProcessesDataContext";
import { getAllProcess } from "@/utils/process";

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
  const [processes, setProcesses] = useState<ProcessesType>();

  const pathname = usePathname();
  const { back } = useRouter();

  const getProcesses = async () => {
    const data = await getAllProcess(1, 1).then(({ data }) => data);
    setProcesses(data);
  };

  useEffect(() => {
    getProcesses();
  }, []);

  if (!processes) return null;

  return (
    <ProcessesDataContext.Provider
      value={{ processes, setProcesses, defaultTableSize: 1 }}
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
          <AdmProfile image={Avatar} name="Nome perfil" role="Função" />
        </header>
        {children}
      </div>
    </ProcessesDataContext.Provider>
  );
}
