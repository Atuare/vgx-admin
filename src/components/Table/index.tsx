"use client";

import {
  ColumnFiltersState,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./TableComponents";

import { useRouter } from "next/navigation";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import { Switch } from "@/components/Switch";
import { FilterButton } from "@/components/Table/FilterButton";
import { useProcesses } from "@/hooks/useProcesses";
import { ProcessType } from "@/interfaces/process.interface";
import {
  useGetAllRolesQuery,
  useGetAllUnitsQuery,
} from "@/services/api/fetchApi";
import { useEffect } from "react";
import { DataTablePagination } from "./Pagination";

interface DataTableProps {
  data: ProcessType[];
  totalCount: number;
  handleClickCell: (row: number) => void;
}

export function DataTable({
  data,
  totalCount,
  handleClickCell,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [unitsOptions, setUnitsOptions] = React.useState<string[]>([]);
  const [rolesOptions, setRolesOptions] = React.useState<string[]>([]);

  const { defaultTableSize, processes } = useProcesses();
  const { push } = useRouter();

  const { data: units, isSuccess: unitsSuccess } = useGetAllUnitsQuery({
    page: 1,
    size: 9999,
  });
  const { data: roles, isSuccess: rolesSuccess } = useGetAllRolesQuery({
    page: 1,
    size: 9999,
  });
  const columnHelper = createColumnHelper<ProcessType>();

  const handleGoDataPage = (rowIndex: number) => {
    processes.processes.map((process, index) => {
      if (rowIndex === index) {
        push(`/process/${process.id}`);
      }
    });
  };

  const handleSwitchChange = (checked: boolean) => {};

  useEffect(() => {
    if (unitsSuccess && rolesSuccess) {
      setRolesOptions(roles.roles.map(role => role.roleText));
      setUnitsOptions(units.units.map(unit => unit.unitName));
    }
  }, [unitsSuccess, rolesSuccess]);

  const columns = [
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => (
        <Switch
          checked={row.getValue("status") === "ATIVO" ? true : false}
          handleSwitchChange={handleSwitchChange}
        />
      ),
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
    columnHelper.accessor("startDate", {
      header: "Data início",
      cell: ({ row }) => {
        return (
          <div>
            {row.getValue("startDate")
              ? dayjs(row.getValue("startDate")).utc().format("DD/MM/YYYY")
              : "-"}
          </div>
        );
      },
    }),

    columnHelper.accessor("endDate", {
      header: "Data fim",
      cell: ({ row }) => (
        <div>
          {row.getValue("endDate")
            ? dayjs(row.getValue("endDate")).utc().format("DD/MM/YYYY")
            : "-"}
        </div>
      ),
    }),

    columnHelper.accessor("role.roleText", {
      header: () => (
        <FilterButton
          title="Processo/Cargo"
          table={table}
          options={rolesOptions}
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
    }),

    columnHelper.accessor("unit.unitName", {
      header: () => (
        <FilterButton
          title="Unidade/Site"
          table={table}
          options={unitsOptions}
        />
      ),
      cell: row => <div>{row.getValue() ? row.getValue() : "-"}</div>,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    pageCount: Math.round(totalCount / defaultTableSize),
  });

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Sem resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} totalCount={totalCount} />
    </>
  );
}
