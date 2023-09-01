"use client";
import { Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { FilterButton } from "@/components/FilterButton";
import { InterviewCandidateEditModal } from "@/components/Modals/InterviewCandidateEdit";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [interviewTableData, setInterviewTableData] =
    useState<IInterviewsType>();
  const [table, setTable] = useState<Table<any>>();
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const { get } = useSearchParams();
  const { setParams } = useTableParams();

  const { data, isSuccess } = useGetAllInterviewsQuery({
    page: currentPage,
    size: 5,
  });

  const { data: units, isSuccess: unitsSuccess } = useGetAllUnitsQuery({
    page: 1,
    size: 9999,
  });

  function handleEditCandidate(data: any) {
    return (
      <InterviewCandidateEditModal
        handleOnSubmit={() => console.log("teste")}
      />
    );
  }

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
        <div
          style={{ paddingLeft: 0 }}
          onClick={() => handleEditCandidate(row.getValue())}
        >
          {formatCpf(row.getValue())}
        </div>
      ),
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
      header: () => (
        <FilterButton
          title="Unidade/Site"
          table={table}
          options={unitsOptions}
          column="candidacy_process_unit_unitName"
        />
      ),
      cell: row => <div>{row.getValue()}</div>,
      filterFn: (row, id, value) => {
        return value.length !== 0 ? value.includes(row.getValue(id)) : true;
      },
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
    setCurrentPage(page);
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
  }, [currentPage]);

  useEffect(() => {
    getFilterValues("candidacy_process_unit_unitName");
  }, [table]);

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
          onClick={downloadTableExcelHandler}
        />

        <SearchInput handleChangeValue={handleInputValue} icon={<Search />} />
      </div>

      <DataTable
        ref={tableRef}
        currentPage={currentPage}
        defaultTableSize={5}
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
