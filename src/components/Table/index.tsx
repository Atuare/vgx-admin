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

import { forwardRef, useEffect, useRef, useState } from "react";
import ReactLoading from "react-loading";
import { DataTablePagination } from "./Pagination";

interface DataTableProps {
  data: any[];
  size: number;
  currentPage: number;
  handleTogglePage: (currentPage: number) => void;
  columns: any;
  setTable: (table: any) => void;
  defaultTableSize: number;
  globalFilterValue?: string;
  loading?: boolean;
  tableName?: string;
  scroll?: boolean;
}

export const DataTable = forwardRef<HTMLButtonElement, DataTableProps>(
  function DataTable(props, ref) {
    const [globalFilter, setGlobalFilter] = useState<string>(
      props.globalFilterValue ?? "",
    );
    const [rowSelection, setRowSelection] = useState<any>({});
    const tableRef = useRef<HTMLTableElement>(null);

    const data = props.data;
    const columns = props.columns;

    const table = useReactTable({
      data,
      columns,
      pageCount: Math.ceil(props.size / props.defaultTableSize),
      initialState: {
        pagination: {
          pageSize: props.defaultTableSize,
        },
      },
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
        const value = String(row.getValue(columnId)).toLowerCase();

        if (value === "ativo" || value === "inativo")
          return Boolean(value === filterValue);

        return value.includes(search);
      },
    });

    useEffect(() => {
      props.setTable(table);
    }, [table]);

    useEffect(() => {
      setGlobalFilter(props.globalFilterValue ?? globalFilter);
    }, [props.globalFilterValue]);

    if (props.loading)
      return (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ReactLoading
            type="spin"
            color="#001866"
            height={"3%"}
            width={"3%"}
          />
        </div>
      );

    return (
      <>
        <div
          style={{
            width: props.scroll ? "83.2vw" : "100%",
            overflowX: props.scroll ? "scroll" : "hidden",
          }}
        >
          <Table ref={tableRef} id={props.tableName}>
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
                  <TableCell colSpan={columns.length}>
                    Sem resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination
          size={props.size}
          handleTogglePage={props.handleTogglePage}
          currentPage={props.currentPage}
          totalPages={Math.ceil(props.size / props.defaultTableSize)}
          table={table}
        />
      </>
    );
  },
);
