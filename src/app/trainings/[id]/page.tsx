"use client";
import { EditSquare, Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { TrainingStatusModal } from "@/components/Modals/TrainingStatusModal";
import { SearchInput } from "@/components/SearchInput";
import { Status } from "@/components/Status";
import { useTableParams } from "@/hooks/useTableParams";
import { TrainingType } from "@/interfaces/training.interface";
import { useGetTrainingByIdQuery } from "@/services/api/fetchApi";
import dayjs from "dayjs";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Traning.module.scss";

const headers = ["DADOS TURMA", "DIA 01", "DIA 02", "DIA 03", "DIA 04"];

export default function TraningDetails() {
  const [training, setTraining] = useState<TrainingType>();
  const [select, setSelect] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const pathname = usePathname();
  const trainingId = pathname.split("/")[2];

  const { setParams } = useTableParams();
  const { get } = useSearchParams();

  const { data, isSuccess, isFetching } = useGetTrainingByIdQuery({
    id: trainingId,
  });

  const handleInputvalue = (value: string) => {};

  const handleTogglePage = async (page: number) => {
    setCurrentPage(page + 1);
  };

  useEffect(() => {
    setParams("page", currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    setParams("table", headers[select]);
  }, [select]);

  useEffect(() => {
    if (isSuccess) {
      setTraining(data?.data);
    }
  }, [isSuccess, isFetching]);

  if (!training) return;

  return (
    <div className={styles.training}>
      <header className={styles.training__header}>
        <div className={styles.training__header__info}>
          <p>
            Criado em {dayjs(training.createdAt).format("DD/MM/YYYY HH:mm")}
          </p>
          <p>Por: {training.trainer}</p>
        </div>

        <div className={styles.training__header__actions}>
          <Button
            buttonType="secondary"
            text="Exportar dados"
            icon={<SystemUpdate />}
          />

          <SearchInput handleChangeValue={handleInputvalue} icon={<Search />} />

          <div className={styles.training__header__actions__rightButtons}>
            <TrainingStatusModal handleOnSubmit={() => {}}>
              <Status type={training.status.replace("_", "")} pointer />
            </TrainingStatusModal>
            <Button
              buttonType="secondary"
              text="Editar"
              icon={<EditSquare />}
            />
          </div>
        </div>
      </header>

      <main className={styles.training__main}>
        <header className={styles.training__main__header}>
          {headers.map((header, index) => (
            <div
              key={crypto.randomUUID()}
              className={`${styles.training__main__header__item} ${
                index === select ? styles.active : ""
              }`}
              onClick={() => setSelect(index)}
            >
              {header}
            </div>
          ))}
        </header>
      </main>
    </div>
  );
}
