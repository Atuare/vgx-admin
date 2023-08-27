"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { forwardRef, useEffect, useState } from "react";
import { DataTablePagination } from "./Pagination";
dayjs.extend(utc);

interface DataTableProps {
  data: any[];
  size: number;
  currentPage: number;
  handleTogglePage: (currentPage: number) => void;
  columns: any;
  setTable: (table: any) => void;
  defaultTableSize: number;
  globalFilterValue?: string;
}

export const DataTable = forwardRef<HTMLTableElement, DataTableProps>(
  function DataTable(props, ref) {
    const [globalFilter, setGlobalFilter] = useState<string>(
      props.globalFilterValue ?? "",
    );

    const [rowSelection, setRowSelection] = useState<any>({});

    const data = props.data;
    const columns = props.columns;

    const table = useReactTable({
      data,
      columns,
      pageCount: Math.round(props.size / props.defaultTableSize),
      state: {
        globalFilter,
        rowSelection,
      },
      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onGlobalFilterChange: setGlobalFilter,
      globalFilterFn: (row, columnId, filterValue) => {
        const search = filterValue.toLowerCase();
        let value = String(row.getValue(columnId)).toLowerCase();

        dayjs(value).isValid()
          ? (value = dayjs(value).utc().format("DD/MM/YYYY").toString())
          : value;

        if (value === "ativo" || value === "inativo")
          return Boolean(value === filterValue);

        return Boolean(value.includes(search));
      },
    });

    useEffect(() => {
      props.setTable(table);
    }, [table]);

    useEffect(() => {
      setGlobalFilter(props.globalFilterValue ?? globalFilter);
    }, [props.globalFilterValue]);

    return (
      <>
        <Table ref={ref}>
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>Sem resultados.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <DataTablePagination
          size={props.size}
          handleTogglePage={props.handleTogglePage}
          currentPage={props.currentPage}
          totalPages={Math.ceil(props.size / props.defaultTableSize)}
        />
      </>
    );
  },
);
