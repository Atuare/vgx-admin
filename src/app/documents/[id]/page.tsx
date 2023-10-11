"use client";
import { Helper, SystemUpdate, UserCheck } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import FlatText from "@/components/FlatText";
import { CandidateStatusModal } from "@/components/Modals/Documents/CandidateStatusModal";
import { DataTable } from "@/components/Table";
import { FilterButton } from "@/components/Table/Filters/FilterButton";
import { ICandidateDocument, IDocument } from "@/interfaces/document.interface";
import { documentCandidateStatus, fakeDocumentsData } from "@/utils/documents";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import styles from "./DocumentsCandidate.module.scss";
dayjs.extend(utc);

const defaultTableSize = 5;

export default function DocumentsCandidate() {
  const [candidate, setCandidate] = useState<IDocument>();
  const [table, setTable] = useState<Table<any>>();
  const [currentPage, setCurrentPage] = useState(1);
  const pathname = usePathname();

  const handleTogglePage = (page: number) => {
    setCurrentPage(page + 1);
  };

  const columnHelper = createColumnHelper<ICandidateDocument>();
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
    columnHelper.accessor("status", {
      id: "documentStatus",
      header: () => (
        <FilterButton
          column="documentStatus"
          options={documentCandidateStatus}
          table={table}
          title="Status"
        />
      ),
      cell: row => {
        return <FlatText text={row.getValue()} type={row.getValue()} />;
      },
      filterFn: (row, id, value) => {
        const newValues = value.map((item: string) =>
          item
            .replace(/\s/g, "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""),
        );

        return value.length !== 0 ? newValues.includes(row.getValue(id)) : true;
      },
    }),
    columnHelper.accessor("name", {
      header: "Documento",
      cell: row => (
        <div>
          <a href="#">{row.getValue()}</a>
        </div>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Enviado em",
      cell: row => (
        <div>{dayjs(row.getValue()).utc().format("DD/MM/YYYY HH:mm:ss")}</div>
      ),
    }),
    columnHelper.accessor("observation", {
      header: "Observação",
      cell: row => <div>{row.getValue()}</div>,
    }),
    columnHelper.accessor("mandatory", {
      header: "Obrigatório",
      cell: row => <div>{row.getValue() ? "SIM" : "NÃO"}</div>,
    }),
    columnHelper.accessor("updatedAt", {
      header: "Atualizado em",
      cell: row => (
        <div>{dayjs(row.getValue()).utc().format("DD/MM/YYYY HH:mm:ss")}</div>
      ),
    }),
  ];

  useEffect(() => {
    const id = pathname.split("/")[2];
    if (id) {
      const candidate = fakeDocumentsData.documents.filter(
        document => document.id === id,
      )[0];

      setCandidate(candidate);
    }
  });

  if (!candidate) return;

  const firstIndex = (currentPage - 1) * defaultTableSize;
  const lastIndex = firstIndex + defaultTableSize;

  return (
    <main className={styles.container}>
      <section className={styles.container__header}>
        <Button
          buttonType="primary"
          text="Download documentos"
          icon={<SystemUpdate />}
        />

        <div className={styles.container__header_right}>
          <Helper />
          <CandidateStatusModal candidate={candidate}>
            <Button
              buttonType="default"
              text="Alterar status"
              icon={<UserCheck />}
              iconLeft
            />
          </CandidateStatusModal>
        </div>
      </section>

      <Fragment>
        <DataTable
          columns={columns}
          currentPage={currentPage}
          data={candidate.documents.slice(firstIndex, lastIndex)}
          defaultTableSize={defaultTableSize}
          handleTogglePage={handleTogglePage}
          setTable={setTable}
          size={candidate.documents.length}
        />
      </Fragment>
    </main>
  );
}
