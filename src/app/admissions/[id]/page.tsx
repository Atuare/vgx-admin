"use client";
import { EditSquare, Search, SystemUpdate, TaskAlt } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import { IAdmission } from "@/interfaces/admissions.interface";
import { getAdmissionById } from "@/utils/admissions";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Admission.module.scss";
dayjs.extend(utc);

export default function AdmissionClass() {
  const [admission, setAdmission] = useState<IAdmission>();
  const pathname = usePathname();

  const getAdmission = async () => {
    const { data } = await getAdmissionById(pathname.split("/")[2]);
    setAdmission(data);
  };

  useEffect(() => {
    getAdmission();
  }, []);

  const handleInputValue = (value: string) => {};

  if (!admission) return;

  return (
    <div className={styles.admission}>
      <section className={styles.admission__info}>
        <p>Criado em {dayjs(admission.createdAt).format("DD/MM/YYYY HH:mm")}</p>
        <p>Por: {admission.examiner}</p>
      </section>
      <section className={styles.admission__actions}>
        <div className={styles.admission__actions__top}>
          <Button
            buttonType="secondary"
            text="Exportar dados"
            icon={<SystemUpdate />}
          />

          <SearchInput handleChangeValue={handleInputValue} icon={<Search />} />

          <div className={styles.admission__actions__top__right}>
            <div
              style={{
                padding: "16px",
                background: "#FFC107",
                borderRadius: "8px",
                fontWeight: "700",
              }}
            >
              EM ANDAMENTO
            </div>
            <Button
              buttonType="secondary"
              text="Editar"
              icon={<EditSquare />}
            />
          </div>
        </div>
        <Button
          buttonType="primary"
          text="Liberar contratos para assinatura"
          icon={<TaskAlt />}
        />
      </section>
    </div>
  );
}
