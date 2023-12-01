"use client";
import { SystemUpdate } from "@/assets/Icons";
import { IDate, IDateModal } from "@/interfaces/configInterviews.interface";
import { DatesSchema } from "@/schemas/configInterviewsSchema";
import { Toast } from "@/utils/toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { Table } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import { useForm } from "react-hook-form";
import { Button } from "../Button";
import { ImportExcelButton } from "../ImportExcelButton";
import { DatesModal } from "../Modals/InterviewsConfig/DatesModal";
import { DatesTable } from "../Tables/Config/Interviews/DatesTable";
import styles from "./ConfigInterview.module.scss";

const defaultTableSize = 15;

interface IDatesProps {
  handleOnSubmit: () => void;
  defaultDates?: IDate[];
  handleBackStep: () => void;
  handleSetInterview: (data: { dates: IDate[] | any }) => void;
}

export function Dates({
  handleOnSubmit,
  defaultDates,
  handleBackStep,
  handleSetInterview,
}: IDatesProps) {
  const [dates, setDates] = useState<IDate[]>(defaultDates ?? []);
  const [table, setTable] = useState<Table<any>>();

  const {
    setValue,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(DatesSchema),
  });

  const handleSubmitDate = (data: IDate[] | any) => {
    handleOnSubmit();
  };

  const handleOnCreateDate = (data: IDateModal) => {
    const newDate = {
      id: crypto.randomUUID(),
      date: data.date,
      description: data.description,
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    };

    const newDates = [...dates, newDate];
    setDates(newDates);
    Toast("success", "Data adicionada com sucesso.");
  };

  const handleOnImportExcel = (data: any) => {
    const importedDates = data.map((item: any) => {
      const date = item.data.split("/");
      date.reverse();
      const newDate = date.join("-");

      return {
        id: crypto.randomUUID(),
        date: dayjs(newDate).toISOString(),
        description: item.descricao,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
      };
    });

    const newDates = [...dates, ...importedDates];
    setDates(newDates);
    Toast("success", "Tabela importada com sucesso.");
  };

  const downloadTableExcelHandler = () => {
    const rows = table?.getRowModel().flatRows.map(row => row.original);

    const columnHeaders = ["Data", "Descrição", "Atualizado em"];

    if (rows && rows.length > 0) {
      const excelData = rows.map(row => ({
        date: dayjs(row.date).format("DD/MM/YYYY"),
        description: row.description,
        updatedAt: dayjs(row.updatedAt).format("DD/MM/YYYY HH:mm:ss"),
      }));

      downloadExcel({
        fileName: `Datas`,
        sheet: `Datas`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    }
  };

  useEffect(() => {
    setValue("dates", dates);
    trigger("dates");
    handleSetInterview({ dates });
  }, [dates]);

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
          <DatesModal handleOnSubmit={handleOnCreateDate} create />
        </div>
      </section>

      <form onSubmit={handleSubmit(handleSubmitDate)}>
        <DatesTable
          defaultTableSize={defaultTableSize}
          dates={dates}
          setTable={setTable}
          handleChangeDates={setDates}
        />

        <footer className={styles.footer}>
          <Button
            buttonType="default"
            text="Voltar"
            type="button"
            onClick={handleBackStep}
          />
          <Button buttonType="primary" text="Salvar" type="submit" />
        </footer>
      </form>
    </main>
  );
}
