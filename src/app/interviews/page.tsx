"use client";
import { Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import { DataTable } from "@/components/Table";
import {
  IInterviewsType,
  InterviewType,
} from "@/interfaces/interviews.interface";
import { useGetAllInterviewsQuery } from "@/services/api/fetchApi";
import { formatCpf } from "@/utils/formatCpf";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useEffect, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import styles from "./Interviews.module.scss";
dayjs.extend(utc);

export default function Interviews() {
  const tableRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [interviewTableData, setInterviewTableData] =
    useState<IInterviewsType>();
  const [table, setTable] = useState<Table<any>>();
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const { data, isSuccess } = useGetAllInterviewsQuery({
    page: currentPage,
    size: 5,
  });

  const columnHelper = createColumnHelper<InterviewType>();
  const columns = [
    columnHelper.accessor("candidacy.candidate.cpf", {
      header: "CPF",
      cell: row => <div>{formatCpf(row.getValue())}</div>,
    }),
    columnHelper.accessor("candidacy.candidate.name", {
      header: "Nome",
      cell: row => <div>{row.getValue()}</div>,
    }),
    columnHelper.accessor("link", {
      header: "Link",
      cell: row => (
        <div className={styles.rowLink}>
          <a href={row.getValue()} target="_blank">
            Acessar link
          </a>
        </div>
      ),
    }),
    columnHelper.accessor("candidacy.process.unit.unitName", {
      header: "Unidade",
      cell: row => <div>{row.getValue()}</div>,
    }),
    columnHelper.accessor("date", {
      header: "Data",
      cell: row => (
        <div>{dayjs(row.getValue()).utc().format("DD/MM/YYYY")}</div>
      ),
    }),
    columnHelper.accessor("date", {
      id: "Hour",
      header: "Hora",
      cell: row => <div>{dayjs(row.getValue()).utc().format("hh:mm")}</div>,
    }),
  ];

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `Processos pag. ${currentPage}`,
    sheet: `Processos pag. ${currentPage}`,
  });

  const handleInputValue = (value: string) => {
    setGlobalFilter(value);
  };

  const handleTogglePage = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (isSuccess) {
      setInterviewTableData(data);
    }
  }, [isSuccess]);

  if (!interviewTableData) return;

  return (
    <div className={styles.interviews}>
      <div className={styles.interviews__actions}>
        <Button
          text="Exportar dados"
          buttonType="secondary"
          icon={<SystemUpdate />}
          onClick={onDownload}
        />

        <SearchInput handleChangeValue={handleInputValue} icon={<Search />} />
      </div>

      <DataTable
        currentPage={currentPage}
        defaultTableSize={5}
        handleTogglePage={handleTogglePage}
        setTable={setTable}
        columns={columns}
        data={interviewTableData?.interviews}
        size={interviewTableData?.totalCount}
        globalFilterValue={globalFilter}
      />
    </div>
  );
}
