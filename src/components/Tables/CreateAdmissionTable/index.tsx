import { CandidateStatus } from "@/components/CandidateStatus";
import { Checkbox } from "@/components/Checkbox";
import { DataTable } from "@/components/Table";
import { CandidateDateFilter } from "@/components/Table/Filters/CandidateDateFilter";
import { CandidateStatusFilterButton } from "@/components/Table/Filters/CandidateStatusFilterButton";
import { FilterButton } from "@/components/Table/Filters/FilterButton";
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
import { formatCurrency } from "@/utils/formatCurrency";
import { formatTimeRange } from "@/utils/formatTimeRange";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
dayjs.extend(utc);

interface CreateAdmissionTableProps {
  table: Table<any> | undefined;
  setTable: (table: Table<any>) => void;
  globalFilter?: string;
  defaultTableSize: number;
  handleOnChangeRowSelection?: (row: any) => void;
}

export function CreateAdmissionTable({
  setTable,
  table,
  globalFilter,
  defaultTableSize,
  handleOnChangeRowSelection,
}: CreateAdmissionTableProps) {
  const [candidates, setCandidates] = useState<CandidacysType>();
  const [tableColumns, setTableColumns] = useState<any[]>([]);
  const { get } = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    get("page") ? Number(get("page")) : 1,
  );

  const [dateFilter, setDateFilter] = useState<string>(
    get("dateType") ? String(get("dateType")) : "CADASTRO",
  );

  const { data, isSuccess, isFetching, refetch } = useGetAllCandidacysQuery({
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

  const handleTogglePage = (page: number) => setCurrentPage(page + 1);

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
        cell: row => <div style={{ width: 180 }}>{row.getValue()}</div>,
      }),
      columnHelper.accessor("candidate.name", {
        header: "Nome",
        cell: row => <div style={{ width: 256 }}>{row.getValue()}</div>,
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
      columnHelper.accessor(
        value =>
          value.candidate?.complementaryInfo?.transportVoucher ? "SIM" : "NÃO",
        {
          header: "Optante VT",
          cell: row => <div style={{ width: 144 }}>{row.getValue()}</div>,
        },
      ),
      columnHelper.accessor(value => formatTimeRange(value.availability), {
        header: "Disponibilidade",
        cell: row => <div style={{ width: 144 }}>{row.getValue()}</div>,
      }),
      columnHelper.accessor(
        value =>
          formatCurrency(
            value.candidate?.complementaryInfo?.transportTaxGoing ?? "0",
          ),
        {
          header: "Tarifa trecho",
          cell: row => <div style={{ width: 144 }}>{row.getValue()}</div>,
        },
      ),
      columnHelper.accessor(
        value =>
          formatCurrency(
            value.candidate?.complementaryInfo?.transportTaxReturn ?? "0",
          ),
        {
          header: "Tarifa integração",
          cell: row => <div style={{ width: 144 }}>{row.getValue()}</div>,
        },
      ),
      columnHelper.accessor(
        value =>
          formatCurrency(
            value.candidate?.complementaryInfo?.transportTaxDaily ?? "0",
          ),
        {
          header: "Tarifa dia",
          cell: row => <div style={{ width: 144 }}>{row.getValue()}</div>,
        },
      ),
      {
        id: "status",
        header: () => <CandidateStatusFilterButton column="status" />,
        cell: (row: any) => (
          <div style={{ width: 260 }}>
            <CandidateStatus data={row.row.original} />
          </div>
        ),
      },
    ];

    setTableColumns(columns);
  };

  useEffect(() => {
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

  if (!candidates) return <p>Não foi possível encontrar os candidatos</p>;

  return (
    <section style={{ width: "100%" }}>
      <DataTable
        columns={tableColumns}
        currentPage={currentPage}
        data={candidates.candidacys}
        defaultTableSize={defaultTableSize}
        handleTogglePage={handleTogglePage}
        setTable={setTable}
        size={candidates.totalCount}
        globalFilterValue={globalFilter ?? ""}
        loading={isFetching}
        handleOnChangeRowSelection={handleOnChangeRowSelection}
        scroll
      />
    </section>
  );
}
