"use client";
import { ArrowBack } from "@/assets/Icons";
import { AdmProfile } from "@/components/AdmProfile";
import FlatText from "@/components/FlatText";
import { IDocument } from "@/interfaces/document.interface";
import styles from "@/styles/layout.module.scss";
import { fakeDocumentsData } from "@/utils/documents";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const [candidate, setCandidate] = useState<IDocument>();
  const pathname = usePathname();
  const { back } = useRouter();

  useEffect(() => {
    const id = pathname.split("/")[2];
    const candidate = fakeDocumentsData.documents.filter(
      data => data.id === id,
    )[0];

    setCandidate(candidate);
  }, [pathname]);

  return (
    <header className={styles.container__header}>
      <div className={styles.header__title}>
        {pathname !== "/documents" && (
          <button onClick={() => back()} style={{ cursor: "pointer" }}>
            <ArrowBack />
          </button>
        )}
        <h1>
          {pathname !== "/documents" && candidate ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FlatText text={candidate.status} type={candidate.status} />
              <span>{candidate.name}</span>
            </div>
          ) : (
            "Documento"
          )}
        </h1>
      </div>
      <AdmProfile />
    </header>
  );
}
