"use client";
import { ArrowBack } from "@/assets/Icons";
import { AdmProfile } from "@/components/AdmProfile";
import { IAdmission } from "@/interfaces/admissions.interface";
import { useGetAdmissionQuery } from "@/services/api/fetchApi";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Layout.module.scss";
dayjs.extend(utc);

const titles = {
  "/admissions/create": "Nova turma admissão",
  "/admissions": "Admissões",
};

export function Header() {
  const [admission, setAdmission] = useState<IAdmission>();
  const pathname = usePathname();
  const { back } = useRouter();

  const { data, isSuccess } = useGetAdmissionQuery({
    admissionId: pathname.split("/")[2],
    page: 1,
    size: 99999999999999,
  });

  useEffect(() => {
    if (pathname !== "/admissions") {
      isSuccess && setAdmission(data.admission);
    }
  }, [isSuccess]);

  return (
    <header className={styles.admissions__header}>
      <div className={styles.header__title}>
        {pathname !== "/admissions" && (
          <button onClick={() => back()} style={{ cursor: "pointer" }}>
            <ArrowBack />
          </button>
        )}
        <h1>
          {titles[pathname as keyof typeof titles]
            ? titles[pathname as keyof typeof titles]
            : admission?.startDate &&
              `Turma admissão - ${dayjs(admission.startDate)
                .utc()
                .format("DD/MM/YYYY")}`}
        </h1>
      </div>
      <AdmProfile />
    </header>
  );
}
