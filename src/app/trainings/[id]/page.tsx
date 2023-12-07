"use client";
import { DonutLarge, EditSquare, Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { TrainingStatusModal } from "@/components/Modals/TrainingStatusModal";
import { SearchInput } from "@/components/SearchInput";
import { TrainingDayDetailsTable } from "@/components/Tables/TrainingDayDetailsTable";
import { TrainingDetailsTable } from "@/components/Tables/TrainingDetailsTable";
import { TrainingLastDayDetailsTable } from "@/components/Tables/TrainingLastDayDetailsTable";
import { useTableParams } from "@/hooks/useTableParams";
import {
  TrainingStatusEnum,
  TrainingType,
} from "@/interfaces/training.interface";
import {
  useGetTrainingByIdQuery,
  useUpdateTrainingMutation,
} from "@/services/api/fetchApi";
import dayjs from "dayjs";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Training.module.scss";

export default function TrainingDetails() {
  const [training, setTraining] = useState<TrainingType>();
  const [trainingHeaders, setTrainingHeaders] = useState<string[]>([]);
  const [select, setSelect] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const pathname = usePathname();
  const trainingId = pathname.split("/")[2];

  const { setParams } = useTableParams();
  const { get } = useSearchParams();

  const { data, isSuccess, isFetching, refetch } = useGetTrainingByIdQuery({
    id: trainingId,
  });

  const [updateTraining] = useUpdateTrainingMutation();

  const handleInputvalue = (value: string) => {};

  const handleTogglePage = async (page: number) => {
    setCurrentPage(page + 1);
  };

  useEffect(() => {
    setParams("page", currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    setParams("table", trainingHeaders[select]);
  }, [select]);

  useEffect(() => {
    if (isSuccess) {
      setTraining(data?.data);
    }
  }, [isSuccess, isFetching]);

  useEffect(() => {
    if (training) {
      setTrainingHeaders(() => {
        const newTrainingHeaders = [
          "DADOS TURMA",
          ...training.trainingDaysList
            .map(v => v.dayNumber)
            .sort((a, b) => a - b)
            .map(v => {
              return `DIA ${v}`;
            }),
        ];
        return newTrainingHeaders;
      });
    }
  }, [training]);

  const handleUpdateTrainingStatus = (data: any) => {
    const status =
      Object.keys(TrainingStatusEnum)[
        Object.keys(TrainingStatusEnum).indexOf(
          data.status.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        )
      ];

    updateTraining({
      id: trainingId,
      status: status,
      reason: data.reason,
    }).then(() => {
      refetch();
    });
  };

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
            <TrainingStatusModal handleOnSubmit={handleUpdateTrainingStatus}>
              <Status type={training.status.replace("_", "")} pointer />
            </TrainingStatusModal>
            <Link href={`/trainings/${trainingId}/edit`}>
              <Button
                buttonType="secondary"
                text="Editar"
                icon={<EditSquare />}
              />
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.training__main}>
        <header className={styles.training__main__header}>
          {trainingHeaders?.map((header, index) => (
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
        {select === 0 ? (
          <TrainingDetailsTable trainingId={trainingId} />
        ) : select === training.trainingDays ? (
          <TrainingLastDayDetailsTable
            trainingId={trainingId}
            trainingDay={select}
          />
        ) : (
          select > 0 && (
            <TrainingDayDetailsTable
              trainingId={trainingId}
              trainingDay={select}
            />
          )
        )}
      </main>
    </div>
  );
}

function Status({ type, pointer = false }: { type: any; pointer?: boolean }) {
  const bgColor = {
    CONCLUIDO: "var(--sucess)",
    EM_ANDAMENTO: "var(--attention)",
    EMANDAMENTO: "var(--attention)",
    CANCELADO: "var(--error)",
    SUSPENSO: "var(--secondary-7)",
  };

  if (type === "EMANDAMENTO") type = "EM_ANDAMENTO";

  const status = TrainingStatusEnum[type as keyof typeof TrainingStatusEnum];

  return (
    <div
      className={styles.status}
      style={{
        background: bgColor[type as keyof typeof bgColor],
        cursor: pointer ? "pointer" : "default",
      }}
    >
      {status?.replace("_", " ")}
      <DonutLarge />
    </div>
  );
}
