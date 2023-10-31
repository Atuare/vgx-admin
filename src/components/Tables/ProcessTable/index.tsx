import { StatusEnum } from "@/enums/status.enum";
import { useTableParams } from "@/hooks/useTableParams";
import { ProcessType, ProcessesType } from "@/interfaces/process.interface";
import {
  useGetAllProcessQuery,
  useGetAllRolesQuery,
  useGetAllUnitsQuery,
  useUpdateProcessMutation,
} from "@/services/api/fetchApi";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Switch } from "../../Switch";
import { DataTable } from "../../Table";
import { FilterButton } from "../../Table/Filters/FilterButton";
import styles from "./ProcessTable.module.scss";
dayjs.extend(utc);

interface ProcessTableProps {
  globalFilter?: string;
  setTable: (table: Table<any>) => void;
  table: Table<any> | undefined;
}

const defaultTableSize = 15;

export function ProcessTable({
  globalFilter,
  setTable,
  table,
}: ProcessTableProps) {
  const [unitsOptions, setUnitsOptions] = useState<string[]>([]);
  const [rolesOptions, setRolesOptions] = useState<string[]>([]);
  const [processes, setProcesses] = useState<ProcessesType>();

  const { get } = useSearchParams();

  const [currentPage, setCurrentPage] = useState<number>(
    get("page") ? Number(get("page")) : 1,
  );

  const [updateProcess] = useUpdateProcessMutation();

  const { push } = useRouter();
  const { setParams } = useTableParams();

  const { data, isSuccess, isFetching, refetch } = useGetAllProcessQuery({
    page: currentPage,
    size: defaultTableSize,
  });
  const { data: units, isSuccess: unitsSuccess } = useGetAllUnitsQuery({
    page: 1,
    size: 9999,
  });
  const { data: roles, isSuccess: rolesSuccess } = useGetAllRolesQuery({
    page: 1,
    size: 9999,
  });

  const handleSwitchChange = (checked: boolean, rowIndex: number) => {
    const newProcess = { id: "", status: checked ? "ATIVO" : "INATIVO" };

    const newProcesses = processes!.processes.map((process, index) => {
      if (rowIndex === index) {
        newProcess.id = process.id;

        return {
          ...process,
          status: checked ? ("ATIVO" as StatusEnum) : ("INATIVO" as StatusEnum),
        };
      }

      return process;
    });

    // quando a animação do switch terminar, atualiza o processo
    setTimeout(() => {
      updateProcess(newProcess);

      setProcesses({
        processes: newProcesses,
        totalCount: processes!.totalCount,
      });
    }, 100);
  };

  const handleGoDataPage = (rowIndex: number) => {
    processes!.processes.map((process, index) => {
      if (rowIndex === index) {
        push(`/process/${process.id}`);
      }
    });
  };

  const handleTogglePage = async (page: number) => {
    setCurrentPage(page + 1);
  };

  const columnHelper = createColumnHelper<ProcessType>();

  const columns = [
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => {
        return (
          <Switch
            checked={row.getValue("status") === "ATIVO" ? true : false}
            handleSwitchChange={checked => {
              handleSwitchChange(checked, row.index);
            }}
          />
        );
      },
    }),
    columnHelper.accessor("limitCandidates", {
      header: "Lim. Candidaturas",
      cell: ({ row }) => (
        <div>
          {row.getValue("limitCandidates")
            ? row.getValue("limitCandidates")
            : "-"}
        </div>
      ),
    }),
    columnHelper.accessor(
      value => dayjs(value.startDate).utc().format("DD/MM/YYYY"),
      {
        id: "startDate",
        header: "Data início",
        cell: row => {
          return <div>{row.getValue() ? row.getValue() : "-"}</div>;
        },
      },
    ),

    columnHelper.accessor(
      value => dayjs(value.endDate).utc().format("DD/MM/YYYY"),
      {
        id: "endDate",
        header: "Data fim",
        cell: row => <div>{row.getValue() ? row.getValue() : "-"}</div>,
      },
    ),

    columnHelper.accessor("role.roleText", {
      header: () => (
        <FilterButton
          title="Processo/Cargo"
          table={table}
          options={rolesOptions}
          column="role_roleText"
        />
      ),
      cell: row => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleGoDataPage(row.row.index)}
        >
          {row.getValue() ? row.getValue() : "-"}
        </div>
      ),
      filterFn: (row, id, value) => {
        return value.length !== 0 ? value.includes(row.getValue(id)) : true;
      },
    }),

    columnHelper.accessor("unit.unitName", {
      header: () => (
        <FilterButton
          title="Unidade/Site"
          table={table}
          options={unitsOptions}
          column="unit_unitName"
        />
      ),
      cell: row => <div>{row.getValue() ? row.getValue() : "-"}</div>,
      filterFn: (row, id, value) => {
        return value.length !== 0 ? value.includes(row.getValue(id)) : true;
      },
    }),
  ];

  useEffect(() => {
    if (unitsSuccess && rolesSuccess) {
      setRolesOptions(roles.roles.map(role => role.roleText));
      setUnitsOptions(units.units.map(unit => unit.unitName));
    }
  }, [unitsSuccess, rolesSuccess]);

  useEffect(() => {
    setParams("page", String(currentPage));
    refetch();
  }, [currentPage]);

  useEffect(() => {
    if (isSuccess) {
      setProcesses(data);
    }
  }, [isSuccess, isFetching]);

  useEffect(() => {
    refetch();
  }, []);

  if (!processes) return null;

  return (
    <section className={styles.process__list}>
      <DataTable
        data={processes.processes}
        size={processes.totalCount}
        columns={columns}
        setTable={setTable}
        defaultTableSize={defaultTableSize}
        currentPage={currentPage}
        handleTogglePage={handleTogglePage}
        globalFilterValue={globalFilter}
      />
    </section>
  );
}
