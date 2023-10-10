"use client";
import { Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import FlatText from "@/components/FlatText";
import { SearchInput } from "@/components/SearchInput";
import { DataTable } from "@/components/Table";
import { DateFilterButton } from "@/components/Table/Filters/DateFilterButton";
import { FilterButton } from "@/components/Table/Filters/FilterButton";
import { DocumentStatusEnum } from "@/enums/status.enum";
import { IDocument } from "@/interfaces/document.interface";
import { useGetAllUnitsQuery } from "@/services/api/fetchApi";
import { documentsStatus, fakeDocumentsData } from "@/utils/documents";
import { formatCpf } from "@/utils/formatCpf";
import { formatWhatsappNumber } from "@/utils/phoneFormating";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import styles from "./Documents.module.scss";

dayjs.extend(utc);

const defaultTableSize = 6;

export default function Documents() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [table, setTable] = useState<Table<any>>();

  const handleTogglePage = (page: number) => {
    setCurrentPage(page + 1);
  };

  const { push } = useRouter();

  const { data: units, isSuccess: isUnitsSuccess } = useGetAllUnitsQuery({
    page: 1,
    size: 999999,
  });

  const columnHelper = createColumnHelper<IDocument>();
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
          options={documentsStatus}
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
    columnHelper.accessor(value => formatCpf(value.cpf), {
      header: "CPF",
      cell: row => <div>{row.getValue()}</div>,
    }),
    columnHelper.accessor("name", {
      header: "Nome",
      cell: row => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => push(`/documents/${row.row.original.id}`)}
        >
          {row.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor(value => formatWhatsappNumber(value.whatsapp ?? ""), {
      header: "WhatsApp",
      cell: row => <div>{formatWhatsappNumber(row.getValue())}</div>,
    }),
    columnHelper.accessor("unit.unitName", {
      id: "unit",
      header: () => (
        <FilterButton
          column="unit"
          options={isUnitsSuccess ? units.units.map(unit => unit.unitName) : []}
          table={table}
          title="Unidade/Site"
        />
      ),
      cell: row => <div>{row.getValue()}</div>,
      filterFn: (row, id, value) => {
        return value.length !== 0 ? value.includes(row.getValue(id)) : true;
      },
    }),
    columnHelper.accessor(
      value => dayjs(value.createdAt).utc().format("DD/MM/YYYY"),
      {
        id: "createdAt",
        header: () => (
          <DateFilterButton
            column="createdAt"
            table={table}
            title="Data Cadastro"
          />
        ),
        cell: row => <div>{row.getValue()}</div>,
        filterFn: (row, id, value) => {
          const date = dayjs(row.getValue(id)).utc().format("DD/MM/YYYY");

          if (value.length === 0) return true;

          return (
            dayjs(date).isAfter(dayjs(value[0])) &&
            dayjs(date).isBefore(dayjs(value[1]))
          );
        },
      },
    ),
  ];

  const downloadTableExcelHandler = () => {
    const selectedRows = table
      ?.getSelectedRowModel()
      .flatRows.map(row => row.original);

    const columnHeaders = [
      "Status",
      "CPF",
      "Nome",
      "WhatsApp",
      "Unidade",
      "Data Cadastro",
    ];

    if (selectedRows && selectedRows.length > 0) {
      const excelData = selectedRows.map(row => ({
        status:
          DocumentStatusEnum[row.status as keyof typeof DocumentStatusEnum],
        cpf: formatCpf(row.cpf),
        name: row.name,
        whatsapp: formatWhatsappNumber(row.whatsapp),
        unit: row.unit.unitName,
        createdAt: dayjs(row.createdAt).utc().format("DD/MM/YYYY"),
      }));

      downloadExcel({
        fileName: `Documentos`,
        sheet: `Documentos pag. ${currentPage}`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    } else {
      const rows = table?.getRowModel().flatRows.map(row => row.original);

      if (rows && rows.length > 0) {
        const excelData = rows.map(row => ({
          status:
            DocumentStatusEnum[row.status as keyof typeof DocumentStatusEnum],
          cpf: formatCpf(row.cpf),
          name: row.name,
          whatsapp: formatWhatsappNumber(row.whatsapp),
          unit: row.unit.unitName,
          createdAt: dayjs(row.createdAt).utc().format("DD/MM/YYYY"),
        }));

        downloadExcel({
          fileName: `Documentos`,
          sheet: `Documentos pag. ${currentPage}`,
          tablePayload: {
            header: columnHeaders,
            body: excelData,
          },
        });
      }
    }
  };

  return (
    <main className={styles.documents}>
      <section className={styles.documents__actions}>
        <Button
          buttonType="secondary"
          text="Exportar dados"
          icon={<SystemUpdate />}
          onClick={downloadTableExcelHandler}
        />

        <SearchInput icon={<Search />} handleChangeValue={setGlobalFilter} />
      </section>

      <Fragment>
        <DataTable
          columns={columns}
          currentPage={currentPage}
          data={fakeDocumentsData.documents}
          defaultTableSize={defaultTableSize}
          handleTogglePage={handleTogglePage}
          setTable={setTable}
          size={fakeDocumentsData.totalCount}
          globalFilterValue={globalFilter}
        />
      </Fragment>
    </main>
  );
}
