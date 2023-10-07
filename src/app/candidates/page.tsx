"use client";
import { Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { CandidateStatus } from "@/components/CandidateStatus";
import { Checkbox } from "@/components/Checkbox";
import { CandidateModal } from "@/components/Modals/CandidateModal";
import { SearchInput } from "@/components/SearchInput";
import { DataTable } from "@/components/Table";
import { CandidateDateFilter } from "@/components/Table/Filters/CandidateDateFilter";
import { CandidateStatusFilterButton } from "@/components/Table/Filters/CandidateStatusFilterButton";
import { FilterButton } from "@/components/Table/Filters/FilterButton";
import { useTableParams } from "@/hooks/useTableParams";
import {
  CandidacyType,
  CandidacysType,
} from "@/interfaces/candidacy.interface";
import {
  useGetAllCandidacysQuery,
  useGetAllRolesQuery,
  useGetAllUnitsQuery,
} from "@/services/api/fetchApi";
import { formatCpf } from "@/utils/formatCpf";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import styles from "./Candidates.module.scss";
dayjs.extend(utc);

const defaultTableSize = 2;

export default function Candidates() {
  const [candidates, setCandidates] = useState<CandidacysType>();
  const [tableColumns, setTableColumns] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [table, setTable] = useState<Table<any>>();

  const { get } = useSearchParams();

  const [dateFilter, setDateFilter] = useState<string>(
    get("dateType") ? String(get("dateType")) : "CADASTRO",
  );

  const { setParams } = useTableParams();
  const [currentPage, setCurrentPage] = useState(
    get("page") ? Number(get("page")) : 1,
  );

  const { data, isFetching, isSuccess, refetch } = useGetAllCandidacysQuery({
    page: currentPage,
    size: defaultTableSize,
  });

  const { data: unitsData, isSuccess: unitsIsSuccess } = useGetAllUnitsQuery({
    page: 1,
    size: 99999,
  });

  const { data: rolesData, isSuccess: rolesIsSuccess } = useGetAllRolesQuery({
    page: 1,
    size: 99999,
  });

  const handleTogglePage = (page: number) => {
    setCurrentPage(page + 1);
  };

  const handleInputValue = (value: string) => {
    setGlobalFilter(value);
  };

  const getFilterValues = (column: string) => {
    const paramsValue = get(column);
    if (paramsValue) {
      const paramsArray = paramsValue.split(",");
      table?.getColumn(column)?.setFilterValue(paramsArray);
    }
  };

  const columnHelper = createColumnHelper<CandidacyType>();

  const getDateTypeAccessor = () => {
    const column = {
      id: dateFilter,
      header: () => (
        <CandidateDateFilter
          column="dateType"
          handleOnChangeFilter={setDateFilter}
        />
      ),
      cell: (row: any) => <div>{row.getValue()}</div>,
    };

    switch (dateFilter) {
      case "CADASTRO":
        return columnHelper.accessor(
          value => dayjs(value.candidate.createdAt).utc().format("DD/MM/YYYY"),
          column,
        );
      case "ENTREVISTA":
        return columnHelper.accessor(
          value => dayjs(value.interview.createdAt).utc().format("DD/MM/YYYY"),
          column,
        );
      case "TREINAMENTO":
        return columnHelper.accessor(
          value => dayjs(value.training.createdAt).utc().format("DD/MM/YYYY"),
          column,
        );
      default:
        return columnHelper.accessor(
          value => dayjs(new Date()).utc().format("DD/MM/YYYY"),
          column,
        );
    }
  };

  const getColumns = async () => {
    const units = unitsData?.units?.map(unit => unit.unitName) ?? [];
    const roles = rolesData?.roles?.map(role => role.roleText) ?? [];

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
      columnHelper.accessor(value => formatCpf(value.candidate.cpf), {
        header: "CPF",
        cell: row => <span>{row.getValue()}</span>,
      }),
      columnHelper.accessor("candidate.name", {
        header: "Nome",
        cell: row => (
          <CandidateModal data={row.row.original}>
            <span style={{ cursor: "pointer" }}>{row.getValue()}</span>
          </CandidateModal>
        ),
      }),
      getDateTypeAccessor(),
      columnHelper.accessor("process.role.roleText", {
        id: "role",
        header: () => (
          <FilterButton
            title="Vaga"
            table={table}
            options={roles}
            column="role"
          />
        ),
        cell: row => <div>{row.getValue()}</div>,
        filterFn: (row, id, value) => {
          return value.length !== 0 ? value.includes(row.getValue(id)) : true;
        },
      }),
      columnHelper.accessor("process.unit.unitName", {
        id: "unit",
        header: () => (
          <FilterButton
            title="Unidade/Site"
            table={table}
            options={units}
            column="unit"
          />
        ),
        cell: row => <div>{row.getValue()}</div>,
        filterFn: (row, id, value) => {
          return value.length !== 0 ? value.includes(row.getValue(id)) : true;
        },
      }),
      {
        id: "status",
        header: () => <CandidateStatusFilterButton column="status" />,
        cell: (row: any) => (
          <div>
            <CandidateStatus data={row.row.original} />
          </div>
        ),
      },
    ];

    setTableColumns(columns);
  };

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

  useEffect(() => {
    if (unitsIsSuccess || rolesIsSuccess) getColumns();
  }, [unitsIsSuccess, rolesIsSuccess]);

  useEffect(() => {
    getFilterValues("unit");
    getFilterValues("role");
    getColumns();
  }, [table]);

  useEffect(() => {
    refetch();
    getColumns();
  }, [dateFilter]);

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
        columns={tableColumns}
        currentPage={currentPage}
        data={candidates.candidacys}
        globalFilterValue={globalFilter}
        defaultTableSize={defaultTableSize}
        handleTogglePage={handleTogglePage}
        setTable={setTable}
        size={candidates.totalCount}
        loading={isFetching}
      />
    </div>
  );
}
