"use client";
import { Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { CandidateModal } from "@/components/Modals/CandidateModal";
import { SearchInput } from "@/components/SearchInput";
import { DataTable } from "@/components/Table";
import { useTableParams } from "@/hooks/useTableParams";
import { ICandidate, ICandidates } from "@/interfaces/candidate.interface";
import { useGetAllCandidatesQuery } from "@/services/api/fetchApi";
import { formatCpf } from "@/utils/formatCpf";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import styles from "./Candidates.module.scss";

const defaultTableSize = 2;

export default function Candidates() {
  const [candidates, setCandidates] = useState<ICandidates>();
  const [globalFilter, setGlobalFilter] = useState("");
  const [table, setTable] = useState<Table<any>>();

  const { get } = useSearchParams();
  const { setParams } = useTableParams();
  const [currentPage, setCurrentPage] = useState(
    get("page") ? Number(get("page")) : 1,
  );

  const { data, isFetching, isSuccess, refetch } = useGetAllCandidatesQuery({
    page: currentPage,
    size: defaultTableSize,
  });

  const handleTogglePage = (page: number) => {
    setCurrentPage(page + 1);
  };

  const handleInputValue = (value: string) => {
    setGlobalFilter(value);
  };

  const columnHelper = createColumnHelper<ICandidate>();
  const columns = [
    columnHelper.accessor("id", {
      id: "select",
      header: "",
      cell: ({ row }) => (
        <Checkbox
          {...{
            isActive: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            onChangeCheckbox: () => row?.toggleSelected(),
          }}
          iconType="solid"
          style={{ padding: 0, transform: "translateY(-2px)" }}
        />
      ),
    }),
    columnHelper.accessor(value => formatCpf(value.cpf), {
      header: "CPF",
      cell: row => <span>{row.getValue()}</span>,
    }),
    columnHelper.accessor("name", {
      header: "Nome",
      cell: row => (
        <CandidateModal candidateId={row.row.original.id}>
          <span>{row.getValue()}</span>
        </CandidateModal>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Data cadastro",
      cell: row => <div>{dayjs(row.getValue()).format("DD/MM/YYYY")}</div>,
    }),
  ];

  function downloadTableExcelHandler() {
    const selectedRows = table
      ?.getSelectedRowModel()
      .flatRows.map(row => row.original);

    const columnHeaders = ["CPF", "Nome", "Data"];

    if (selectedRows && selectedRows.length > 0) {
      const excelData = selectedRows.map(row => ({
        cpf: formatCpf(row.cpf),
        name: row.name,
        date: row.createdAt,
      }));

      downloadExcel({
        fileName: `Candidatos`,
        sheet: `Candidatos pag. ${currentPage}`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    } else {
      const rows = table?.getRowModel().flatRows.map(row => row.original);

      if (rows && rows.length > 0) {
        const excelData = rows.map(row => ({
          cpf: formatCpf(row.cpf),
          name: row.name,
          date: row.createdAt,
        }));

        downloadExcel({
          fileName: `Candidatos`,
          sheet: `Candidatos pag. ${currentPage}`,
          tablePayload: {
            header: columnHeaders,
            body: excelData,
          },
        });
      }
    }
  }

  useEffect(() => {
    setParams("page", String(currentPage));
    refetch();
  }, [currentPage]);

  useEffect(() => {
    isSuccess && setCandidates(data);
  }, [isSuccess, isFetching]);

  if (!candidates) return;

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

      <DataTable
        columns={columns}
        currentPage={currentPage}
        data={candidates.data}
        globalFilterValue={globalFilter}
        defaultTableSize={defaultTableSize}
        handleTogglePage={handleTogglePage}
        setTable={setTable}
        size={candidates.total}
        loading={isFetching}
      />
    </div>
  );
}
