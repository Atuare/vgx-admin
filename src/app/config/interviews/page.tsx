"use client";
import { AddCircle, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { InterviewHomeTable } from "@/components/Tables/Config/Interviews/InterviewHomeTable";
import { Table } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import styles from "./InterviewsConfig.module.scss";

export default function InterviewsConfigPage() {
  const [table, setTable] = useState<Table<any>>();

  const downloadTableExcelHandler = () => {
    const columnHeaders = [
      "Status",
      "Unidade",
      "Tipo de entrevista",
      "Hora limite",
      "Data inicial",
      "Dias disponíveis",
      "Atualizado em",
    ];

    const rows = table?.getRowModel().flatRows.map(row => row.original);

    if (rows && rows.length > 0) {
      const excelData = rows.map(row => ({
        status: row.status ? "ATIVO" : "INATIVO",
        unitOrSite: row.unitOrSite,
        type: row.type === "REMOTE" ? "Remoto" : "Presencial",
        limit: dayjs(row.limitTime).format("HH:mm:ss"),
        initialDate: `D+${row.availableDays}`,
        availableDays: `${row.availableDays}`,
        updatedAt: dayjs(row.updatedAt).format("DD/MM/YYYY HH:mm:ss"),
      }));

      downloadExcel({
        fileName: `Configurações - Agendamentos de entrevistas`,
        sheet: `Configurações - Agendamentos de entrevistas`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    }
  };

  return (
    <div className={styles.interview}>
      <section className={styles.interview__actions}>
        <Button
          buttonType="secondary"
          text="Exportar dados"
          icon={<SystemUpdate />}
          onClick={downloadTableExcelHandler}
        />

        <Link href="/config/interviews/create">
          <Button
            buttonType="primary"
            text="Novo Agendamento"
            icon={<AddCircle />}
          />
        </Link>
      </section>

      <InterviewHomeTable setTable={setTable} table={table} />
    </div>
  );
}
