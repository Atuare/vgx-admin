"use client";

import { AddCircle, Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import { ExamsTable } from "@/components/Tables/ExamsTable";
import { ExamsStatusEnum } from "@/enums/status.enum";
import { Table } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import styles from "./Exams.module.scss";
dayjs.extend(utc);

const defaultTableSize = 5;

export default function Exams() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [table, setTable] = useState<Table<any>>();

  const { push } = useRouter();

  const downloadTableExcelHandler = () => {
    const selectedRows = table
      ?.getSelectedRowModel()
      .flatRows.map(row => row.original);

    const columnHeaders = [
      "Status",
      "Quantidade",
      "Data e hora",
      "Examinador",
      "Local",
    ];

    if (selectedRows && selectedRows.length > 0) {
      const excelData = selectedRows.map(row => ({
        status: ExamsStatusEnum[
          row.status as keyof typeof ExamsStatusEnum
        ].replace("_", " "),
        limit: row.candidateLimit,
        dateandtime: `${dayjs(row.startDate).utc().format("DD/MM/YYYY")} ${
          row.hour
        }`,
        examiner: row.examiner,
        local: row.location,
      }));

      downloadExcel({
        fileName: `Exames admissionais`,
        sheet: `Exames admissionais`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    } else {
      const rows = table?.getRowModel().flatRows.map(row => row.original);

      if (rows && rows.length > 0) {
        const excelData = rows.map(row => ({
          status: ExamsStatusEnum[
            row.status as keyof typeof ExamsStatusEnum
          ].replace("_", " "),
          limit: row.candidateLimit,
          dateandtime: `${dayjs(row.startDate)
            .utc()
            .format("DD/MM/YYYY")}${" "}${dayjs(row.time).format("HH:mm")}`,
          examiner: row.examiner,
          local: row.location,
        }));

        downloadExcel({
          fileName: `Exames admissionais`,
          sheet: `Exames admissionais`,
          tablePayload: {
            header: columnHeaders,
            body: excelData,
          },
        });
      }
    }
  };

  return (
    <main className={styles.exams}>
      <section className={styles.exams__actions}>
        <Button
          buttonType="secondary"
          text="Exportar dados"
          icon={<SystemUpdate />}
          onClick={downloadTableExcelHandler}
        />

        <SearchInput handleChangeValue={setGlobalFilter} icon={<Search />} />

        <Button
          buttonType="primary"
          text="Nova turma exame"
          icon={<AddCircle />}
          onClick={() => push("/exams/create")}
        />
      </section>

      <ExamsTable
        defaultTableSize={defaultTableSize}
        setTable={setTable}
        table={table}
        globalFilter={globalFilter}
      />
    </main>
  );
}
