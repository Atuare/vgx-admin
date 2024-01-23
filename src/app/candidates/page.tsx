"use client";
import { Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import { CandidatesTable } from "@/components/Tables/CandidatesTable";
import { formatCpf } from "@/utils/formatCpf";
import { Table } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import styles from "./Candidates.module.scss";

dayjs.extend(utc);
const defaultTableSize = 15;

const convertDateFilterSelect = {
  CADASTRO: "Data Cadastro",
  PROVA: "Data Prova",
  ENTREVISTA: "Data Entrevista",
  TREINAMENTO: "Data Treinamento",
};

export default function Candidates() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [table, setTable] = useState<Table<any>>();
  const [dateType, setDateType] = useState<string>("CADASTRO");

  const handleInputValue = (value: string) => {
    setGlobalFilter(value);
  };

  const downloadTableExcelHandler = () => {
    const selectedRows = table
      ?.getSelectedRowModel()
      .flatRows.map(row => row.original);

    const columnHeaders = [
      "CPF",
      "Nome",
      convertDateFilterSelect[dateType as keyof typeof convertDateFilterSelect],
      "Cargo",
      "Unidade",
    ];

    if (selectedRows && selectedRows.length > 0) {
      const excelData = selectedRows.map(row => ({
        cpf: formatCpf(row.candidate.cpf) || "",
        name: row.candidate.name,
        date: dayjs(
          dateType === "CADASTRO"
            ? row.candidate.createdAt
            : dateType === "ENTREVISTA"
              ? row.interview.createdAt
              : dateType === "TREINAMENTO"
                ? row.training.createdAt
                : row.createdAt,
        )
          .utc()
          .format("DD/MM/YYYY"),
        role: row.process.role.roleText,
        unit: row.process.unit.unitName,
      }));

      downloadExcel({
        fileName: `Candidatos`,
        sheet: `Candidatos `,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    } else {
      const rows = table?.getRowModel().flatRows.map(row => row.original);

      if (rows && rows.length > 0) {
        const excelData = rows.map(row => ({
          cpf: formatCpf(row.candidate.cpf) || "",
          name: row.candidate.name,
          date: dayjs(
            dateType === "CADASTRO"
              ? row.candidate.createdAt
              : dateType === "ENTREVISTA"
                ? row.interview.createdAt
                : dateType === "TREINAMENTO"
                  ? row.training.createdAt
                  : row.createdAt,
          )
            .utc()
            .format("DD/MM/YYYY"),
          role: row.process.role.roleText,
          unit: row.process.unit.unitName,
        }));

        downloadExcel({
          fileName: `Candidatos`,
          sheet: `Candidatos `,
          tablePayload: {
            header: columnHeaders,
            body: excelData,
          },
        });
      }
    }
  };

  return (
    <div className={styles.candidates}>
      <div className={styles.candidates__actions}>
        <Button
          text="Exportar dados"
          buttonType="secondary"
          icon={<SystemUpdate />}
          onClick={downloadTableExcelHandler}
        />

        <SearchInput handleChangeValue={handleInputValue} icon={<Search />} />
      </div>

      <CandidatesTable
        defaultTableSize={defaultTableSize}
        setTable={setTable}
        table={table}
        globalFilterValue={globalFilter}
        onToggleDateType={setDateType}
      />
    </div>
  );
}
