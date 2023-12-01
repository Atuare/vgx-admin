"use client";

import { AddCircle, Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import { TrainingTable } from "@/components/Tables/TrainingTable";
import { Table } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import styles from "./training.module.scss";

const defaultTableSize = 5;

export default function Trainings() {
  const [globalFilter, setGlobalFilter] = useState<string>("");
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
        status: row.status,
      }));

      downloadExcel({
        fileName: `Treinamentos`,
        sheet: `Treinamentos`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    } else {
      const rows = table?.getRowModel().flatRows.map(row => row.original);

      if (rows && rows.length > 0) {
        const excelData = rows.map(row => ({
          status: row.status,
        }));

        downloadExcel({
          fileName: `Treinamentos`,
          sheet: `Treinamentos`,
          tablePayload: {
            header: columnHeaders,
            body: excelData,
          },
        });
      }
    }
  };

  return (
    <div className={styles.training}>
      <div className={styles.training__actions}>
        <Button
          text="Exportar dados"
          buttonType="secondary"
          icon={<SystemUpdate />}
          onClick={downloadTableExcelHandler}
        />

        <SearchInput handleChangeValue={setGlobalFilter} icon={<Search />} />
        <Button
          text="Novo Treinamento"
          buttonType="primary"
          icon={<AddCircle />}
          onClick={() => push("/trainings/create")}
        />
      </div>
      <TrainingTable
        globalFilter={globalFilter}
        table={table}
        setTable={setTable}
        defaultTableSize={defaultTableSize}
      />
    </div>
  );
}
