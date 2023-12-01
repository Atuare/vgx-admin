"use client";
import { ArrowBack } from "@/assets/Icons";
import styles from "@/styles/layout.module.scss";
import { usePathname, useRouter } from "next/navigation";

export function LayoutHeader() {
  const pathname = usePathname();
  const { back } = useRouter();

  return (
    <div className={styles.header__title}>
      {pathname !== "/config/tests" && (
        <button onClick={() => back()}>
          <ArrowBack />
        </button>
      )}
      <h1>
        {(pathname === "/config/tests/create" && "Nova prova") ||
          (pathname === "/config/tests" && "Configurações - Prova") ||
          "Editar prova"}
      </h1>
    </div>
  );
}
