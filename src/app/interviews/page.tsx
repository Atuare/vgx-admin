"use client";
import { Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { DateFilterButton } from "@/components/DateFilterButton";
import { FilterButton } from "@/components/FilterButton";
import { DataModal } from "@/components/Modals/DataModal";
import { SearchInput } from "@/components/SearchInput";
import { DataTable } from "@/components/Table";
import { useTableParams } from "@/hooks/useTableParams";
import {
  IInterviewsType,
  InterviewType,
} from "@/interfaces/interviews.interface";
import {
  useGetAllInterviewsQuery,
  useGetAllUnitsQuery,
} from "@/services/api/fetchApi";
import { formatCpf } from "@/utils/formatCpf";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import styles from "./Interviews.module.scss";
dayjs.extend(utc);

export default function Interviews() {
  const [unitsOptions, setUnitsOptions] = useState<string[]>([]);
  const tableRef = useRef(null);
  const [interviewTableData, setInterviewTableData] =
    useState<IInterviewsType>();
  const [table, setTable] = useState<Table<any>>();
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const { get } = useSearchParams();
  const { setParams } = useTableParams();

  const [currentPage, setCurrentPage] = useState(
    get("page") ? Number(get("page")) : 1,
  );

  const { data, isSuccess, isFetching, refetch } = useGetAllInterviewsQuery({
    page: currentPage,
    size: 1,
  });

  const { data: units, isSuccess: unitsSuccess } = useGetAllUnitsQuery({
    page: 1,
    size: 9999,
  });

  const columnHelper = createColumnHelper<InterviewType>();
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
          iconType="outline"
          style={{ padding: 0, transform: "translateY(-2px)" }}
        />
      ),
    }),
    columnHelper.accessor("candidacy.candidate.cpf", {
      header: "CPF",
      cell: row => (
        <div style={{ paddingLeft: 0 }}>{formatCpf(row.getValue())}</div>
      ),
    }),
    columnHelper.accessor("candidacy.candidate.name", {
      header: "Nome",
      cell: row => (
        <DataModal data={row.row.original}>
          <div style={{ cursor: "pointer" }}>{row.getValue()}</div>
        </DataModal>
      ),
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
      id: "unit",
      header: () => (
        <FilterButton
          title="Unidade/Site"
          table={table}
          options={unitsOptions}
          column="unit"
        />
      ),
      cell: row => <div>{row.getValue()}</div>,
      filterFn: (row, id, value) => {
        return value.length !== 0 ? value.includes(row.getValue(id)) : true;
      },
    }),
    columnHelper.accessor(
      value => dayjs(value.date).utc().format("DD/MM/YYYY"),
      {
        id: "date",
        header: () => (
          <DateFilterButton column="date" table={table} title="Data" />
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
    columnHelper.accessor("date", {
      id: "Hour",
      header: "Hora",
      cell: row => <div>{dayjs(row.getValue()).utc().format("hh:mm")}</div>,
    }),
  ];

  function downloadTableExcelHandler() {
    const selectedRows = table
      ?.getSelectedRowModel()
      .flatRows.map(row => row.original);

    const columnHeaders = [
      "CPF",
      "Nome",
      "Link",
      "Unidade/Site",
      "Data",
      "Hora",
    ];

    if (selectedRows && selectedRows.length > 0) {
      const excelData = selectedRows.map(row => ({
        cpf: formatCpf(row.candidacy.candidate.cpf),
        name: row.candidacy.candidate.name,
        link: row.link,
        unit: row.candidacy.process.unit.unitName,
        date: dayjs(row.date).utc().format("DD/MM/YYYY"),
        hour: dayjs(row.date).utc().format("hh:mm"),
      }));

      downloadExcel({
        fileName: `Entrevistas`,
        sheet: `Entrevistas pag. ${currentPage}`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    } else {
      const rows = table?.getRowModel().flatRows.map(row => row.original);

      if (rows && rows.length > 0) {
        const excelData = rows.map(row => ({
          cpf: formatCpf(row.candidacy.candidate.cpf),
          name: row.candidacy.candidate.name,
          link: row.link,
          unit: row.candidacy.process.unit.unitName,
          date: dayjs(row.date).utc().format("DD/MM/YYYY"),
          hour: dayjs(row.date).utc().format("hh:mm"),
        }));

        downloadExcel({
          fileName: `Entrevistas`,
          sheet: `Entrevistas pag. ${currentPage}`,
          tablePayload: {
            header: columnHeaders,
            body: excelData,
          },
        });
      }
    }
  }

  const handleInputValue = (value: string) => {
    setGlobalFilter(value);
  };

  const handleTogglePage = (page: number) => {
    setCurrentPage(page + 1);
  };

  useEffect(() => {
    if (unitsSuccess) {
      setUnitsOptions(units.units.map(unit => unit.unitName));
    }
  }, [unitsSuccess]);

  const getFilterValues = (column: string) => {
    const paramsValue = get(column);
    if (paramsValue) {
      const paramsArray = paramsValue.split(",");
      table?.getColumn(column)?.setFilterValue(paramsArray);
    }
  };

  useEffect(() => {
    setParams("page", String(currentPage));
    refetch();
  }, [currentPage]);

  useEffect(() => {
    getFilterValues("unit");
    getFilterValues("date");
  }, [table]);

  useEffect(() => {
    if (isSuccess) {
      setInterviewTableData(data);
    }
  }, [isSuccess, isFetching]);

  if (!interviewTableData) return;

  return (
    <div className={styles.interviews}>
      <div className={styles.interviews__actions}>
        <Button
          text="Exportar dados"
          buttonType="secondary"
          icon={<SystemUpdate />}
          onClick={downloadTableExcelHandler}
        />

        <SearchInput handleChangeValue={handleInputValue} icon={<Search />} />
      </div>

      <DataTable
        ref={tableRef}
        currentPage={currentPage}
        defaultTableSize={1}
        handleTogglePage={handleTogglePage}
        setTable={setTable}
        columns={columns}
        data={interviewTableData?.interviews}
        size={interviewTableData?.totalCount}
        globalFilterValue={globalFilter}
        tableName="Entrevistas"
      />
    </div>
  );
}
