"use client";
import { AddCircle, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { DataTable } from "@/components/Table";
import { Actions } from "@/components/Tables/components/Actions";
import { useTableParams } from "@/hooks/useTableParams";
import { ITest, ITests } from "@/interfaces/tests.interface";
import { useGetAllTestsQuery } from "@/services/api/fetchApi";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import styles from "./TestsConfig.module.scss";

const defaultTableSize = 10;

export default function TestsConfigPage() {
  const [tests, setTests] = useState<ITests>();
  const [table, setTable] = useState<Table<any>>();

  const { push } = useRouter();

  const { setParams } = useTableParams();
  const { get } = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    get("page") ? Number(get("page")) : 1,
  );

  const { data, isSuccess, isFetching, refetch } = useGetAllTestsQuery({
    page: currentPage,
    size: defaultTableSize,
    orderBy: "createdAt",
    direction: "DESC",
  });

  const handleTogglePage = (page: number) => {
    setCurrentPage(page);
  };

  const downloadTableExcelHandler = () => {
    const columnHeaders = [
      "Unidade",
      "Total de questões português",
      "Total de questões matemática",
      "Total de questões noções informática",
      "Nota mínima para aprovação",
      "Tempo máx prova (minutos)",
      "Atualizado em",
    ];

    const rows = table?.getRowModel().flatRows.map(row => row.original);

    if (rows && rows.length > 0) {
      const excelData = rows.map(row => ({
        unit: row.unit.unitName,
        portTotal: row.portTotal,
        matTotal: row.matTotal,
        compTotal: row.compTotal,
        minGrade: `${
          (row.portMinScore + row.matMinScore + row.compMinScore) / 3
        }`,
        maxTime: row.maxTime,
        updatedAt: dayjs(row.updatedAt).format("DD/MM/YYYY HH:mm:ss"),
      }));

      downloadExcel({
        fileName: `Prova`,
        sheet: `Prova`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    }
  };

  const columnHelper = createColumnHelper<ITest>();
  const columns = [
    columnHelper.accessor("unit.unitName", {
      header: "Unidade",
      cell: row => <div>{row.getValue()}</div>,
    }),
    columnHelper.accessor("portTotal", {
      header: () => (
        <div style={{ width: 160, margin: "0 auto" }}>
          Total de questões português
        </div>
      ),
      cell: row => <div>{row.getValue()}</div>,
    }),
    columnHelper.accessor("matTotal", {
      header: () => (
        <div style={{ width: 160, margin: "0 auto" }}>
          Total de questões matemática
        </div>
      ),
      cell: row => <div>{row.getValue()}</div>,
    }),
    columnHelper.accessor("compTotal", {
      header: () => (
        <div style={{ width: 160, margin: "0 auto" }}>
          Total de questões noções informática
        </div>
      ),
      cell: row => <div>{row.getValue()}</div>,
    }),
    {
      id: "minGrade",
      header: () => (
        <div style={{ width: 160, margin: "0 auto" }}>
          Nota mínima para aprovação
        </div>
      ),
      cell: (row: any) => {
        const media =
          (row.row.original?.portMinScore +
            row.row.original?.matMinScore +
            row.row.original?.compMinScore) /
          3;

        return <div>{media}</div>;
      },
    },
    columnHelper.accessor("maxTime", {
      header: () => (
        <div style={{ width: 160, margin: "0 auto" }}>
          Tempo máx prova (minutos)
        </div>
      ),
      cell: row => <div>{row.getValue()}</div>,
    }),
    {
      header: "Ações",
      cell: (row: any) => {
        const id = String(row.row.original.id);
        const handleDeleteRow = () => {};

        return (
          <Actions
            handleDelete={handleDeleteRow}
            href={`/config/tests/${id}`}
            value={"Prova"}
          />
        );
      },
    },
    columnHelper.accessor(
      value => dayjs(value.updatedAt).format("DD/MM/YYYY HH:mm:ss"),
      {
        header: "Atualizado em:",
        cell: row => <div>{row.getValue()}</div>,
      },
    ),
  ];

  useEffect(() => {
    refetch();
    setParams("page", currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    isSuccess && setTests(data);
  }, [isSuccess, isFetching]);

  if (!tests) return;

  return (
    <div className={styles.test}>
      <section className={styles.test__actions}>
        <Button
          buttonType="secondary"
          text="Exportar dados"
          icon={<SystemUpdate />}
          onClick={downloadTableExcelHandler}
        />

        <Button
          buttonType="primary"
          text="Nova Prova"
          icon={<AddCircle />}
          onClick={() => push("/config/tests/create")}
        />
      </section>

      {tests && (
        <DataTable
          currentPage={currentPage}
          data={tests.tests}
          columns={columns}
          defaultTableSize={defaultTableSize}
          handleTogglePage={handleTogglePage}
          setTable={setTable}
          size={tests.totalCount}
        />
      )}
    </div>
  );
}
