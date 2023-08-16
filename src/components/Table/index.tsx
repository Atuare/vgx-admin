"use client";

import * as React from "react";
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
import { ProcessType } from "@/@types/Process";
import { DataTablePagination } from "./Pagination";
import { useProcesses } from "@/hooks/useProcesses";

interface DataTableProps {
  data: ProcessType[];
  totalCount: number;
  handleClickCell: (row: number) => void;
}

const handleSwitchChange = () => {
  // console.log("switch");
};

export function DataTable({
  data,
  totalCount,
  handleClickCell,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const { push } = useRouter();

  const { defaultTableSize, processes } = useProcesses();
  const columnHelper = createColumnHelper<ProcessType>();

  const handleGoDataPage = (rowIndex: number) => {
    processes.processes.map((process, index) => {
      if (rowIndex === index) {
        push(`/process/${process.id}`);
      }
    });
  };

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

    columnHelper.accessor("unit.unitName", {
      header: () => <FilterButton title="Processo/Cargo" />,
      cell: row => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleGoDataPage(row.row.index)}
        >
          {row.getValue() ? row.getValue() : "-"}
        </div>
      ),
    }),

    columnHelper.accessor("role.roleText", {
      header: () => <FilterButton title="Unidade/Site" />,
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
