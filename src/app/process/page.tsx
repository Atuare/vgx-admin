"use client";
import { useState } from "react";

import styles from "./Process.module.scss";

import { AddCircle, Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import { ProcessTable } from "@/components/Tables/ProcessTable";
import { Table } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import { downloadExcel } from "react-export-table-to-excel";

export default function Process() {
  const [value, setValue] = useState<string>("");
  const [table, setTable] = useState<Table<any>>();

  function handleInputValue(value: string) {
    setValue(value);
  }

  function downloadTableExcelHandler() {
    const selectedRows = table
      ?.getSelectedRowModel()
      .flatRows.map(row => row.original);

    const columnHeaders = [
      "Status",
      "Lim. Candidaturas",
      "Data início",
      "Data fim",
      "Processo/Cargo",
      "Unidade/Site",
    ];

    if (selectedRows && selectedRows.length > 0) {
      const excelData = selectedRows.map(row => ({
        status: row.status,
        candidates: row.limitCandidates,
        startDate: dayjs(row.startDate).utc().format("DD/MM/YYYY"),
        endDate: dayjs(row.endDate).utc().format("DD/MM/YYYY"),
        role: row.role.roleText,
        unit: row.unit.unitName,
      }));

      downloadExcel({
        fileName: `Processo`,
        sheet: `Processo`,
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
          candidates: row.limitCandidates,
          startDate: dayjs(row.startDate).utc().format("DD/MM/YYYY"),
          endDate: dayjs(row.endDate).utc().format("DD/MM/YYYY"),
          role: row.role.roleText,
          unit: row.unit.unitName,
        }));

        downloadExcel({
          fileName: `Processo`,
          sheet: `Processo`,
          tablePayload: {
            header: columnHeaders,
            body: excelData,
          },
        });
      }
    }
  }

  return (
    <div className={styles.process}>
      <div className={styles.process__actions}>
        <Button
          text="Exportar dados"
          buttonType="secondary"
          icon={<SystemUpdate />}
          onClick={downloadTableExcelHandler}
        />

        <SearchInput handleChangeValue={handleInputValue} icon={<Search />} />
        <Link href="/process/create">
          <Button
            text="Novo Processo"
            buttonType="primary"
            icon={<AddCircle />}
          />
        </Link>
      </div>
      <ProcessTable globalFilter={value} setTable={setTable} table={table} />
    </div>
  );
}
