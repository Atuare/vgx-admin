"use client";
import { SystemUpdate } from "@/assets/Icons";
import {
  IScheduling,
  ISchedulingModal,
} from "@/interfaces/configInterviews.interface";
import { SchedulingsSchema } from "@/schemas/configInterviewsSchema";
import { convertDayOfWeek, convertDayOfWeekToEnglish } from "@/utils/dates";
import { Toast } from "@/utils/toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { Table } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import { useForm } from "react-hook-form";
import { Button } from "../Button";
import { ImportExcelButton } from "../ImportExcelButton";
import { SchedulingModal } from "../Modals/InterviewsConfig/SchedulingModal";
import { SchedulingTable } from "../Tables/Config/Interviews/SchedulingTable";
import styles from "./ConfigInterview.module.scss";

const defaultTableSize = 15;

interface ISchedulings {
  handleOnSubmit: (data: { schedulings: IScheduling[] | any }) => void;
  defaultSchedulings?: IScheduling[];
  handleBackStep: () => void;
}

export function Schedulings({
  handleOnSubmit,
  defaultSchedulings,
  handleBackStep,
}: ISchedulings) {
  const [schedulings, setSchedulings] = useState<IScheduling[]>(
    defaultSchedulings ?? [],
  );
  const [table, setTable] = useState<Table<any>>();

  const {
    setValue,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SchedulingsSchema),
  });

  const handleSubmitScheduling = (data: IScheduling[] | any) => {
    handleOnSubmit({
      schedulings: data.schedulings,
    });
  };

  const handleOnCreateHour = (data: ISchedulingModal) => {
    const newScheduling = {
      id: crypto.randomUUID(),
      date: data.date,
      schedulingLimit: Number(data.schedulingLimit),
      dayOfWeek: data.dayOfWeek,
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    };

    const newSchedulings = [...schedulings, newScheduling];
    setSchedulings(newSchedulings);
    Toast("success", "Horário adicionado com sucesso.");
  };

  const handleOnImportExcel = (data: any) => {
    const importedSchedulings = data.map((item: any) => {
      return {
        id: crypto.randomUUID(),
        date: dayjs()
          .set("hour", Number(item.horario.split(":")[0]))
          .set("minute", Number(item.horario.split(":")[1]))
          .toISOString(),
        schedulingLimit: Number(item.limite),
        dayOfWeek: convertDayOfWeekToEnglish(item.dia),
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
      };
    });

    const newSchedulings = [...schedulings, ...importedSchedulings];
    setSchedulings(newSchedulings);
    Toast("success", "Tabela importada com sucesso.");
  };

  const downloadTableExcelHandler = () => {
    const rows = table?.getRowModel().flatRows.map(row => row.original);

    const columnHeaders = [
      "Horário",
      "Limite de Agendamentos",
      "Dia da Semana",
      "Atualizado em",
    ];

    if (rows && rows.length > 0) {
      const excelData = rows.map(row => ({
        hour: dayjs(row.date).format("HH:mm"),
        schedulingLimit: row.schedulingLimit,
        dayOfWeek: convertDayOfWeek(row.dayOfWeek),
        updatedAt: dayjs(row.updatedAt).format("DD/MM/YYYY HH:mm:ss"),
      }));

      downloadExcel({
        fileName: `Horários`,
        sheet: `Horários`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    }
  };

  useEffect(() => {
    setValue("schedulings", schedulings);
    trigger("schedulings");
  }, [schedulings]);

  return (
    <main className={styles.container}>
      <section className={styles.actions}>
        <Button
          buttonType="secondary"
          text="Exportar dados"
          icon={<SystemUpdate />}
          onClick={downloadTableExcelHandler}
          type="button"
        />

        <div className={styles.actions__right}>
          <ImportExcelButton handleOnImportExcel={handleOnImportExcel} />
          <SchedulingModal handleOnSubmit={handleOnCreateHour} create />
        </div>
      </section>

      <form onSubmit={handleSubmit(handleSubmitScheduling)}>
        <SchedulingTable
          defaultTableSize={defaultTableSize}
          schedulings={schedulings}
          setTable={setTable}
          handleChangeSchedulings={setSchedulings}
        />

        <span className="error-message">{errors.schedulings?.message}</span>

        <footer className={styles.footer}>
          <Button
            buttonType="default"
            text="Voltar"
            type="button"
            onClick={handleBackStep}
          />
          <Button buttonType="primary" text="Próximo" type="submit" />
        </footer>
      </form>
    </main>
  );
}
