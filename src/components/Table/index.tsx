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
  handleOnChangeRowSelection?: (row: any) => void;
  primary2Color?: boolean;
  disablePagination?: boolean;
}

export const DataTable = forwardRef<HTMLButtonElement, DataTableProps>(
  function DataTable(props, ref) {
    const [globalFilter, setGlobalFilter] = useState<string>(
      props.globalFilterValue ?? "",
    );
    const [rowSelection, setRowSelection] = useState<any>({});
    const tableRef = useRef<HTMLTableElement>(null);

    const {
      data,
      columns,
      setTable,
      defaultTableSize,
      size,
      globalFilterValue,
      currentPage,
      handleTogglePage,
      loading,
      scroll,
      tableName,
      handleOnChangeRowSelection,
      primary2Color,
      disablePagination = false,
    } = props;

    const table = useReactTable({
      data,
      columns,
      pageCount: Math.ceil(size / defaultTableSize),
      initialState: {
        pagination: {
          pageSize: defaultTableSize,
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
      handleOnChangeRowSelection?.(rowSelection);
    }, [rowSelection]);

    useEffect(() => {
      setTable(table);
    }, [table]);

    useEffect(() => {
      setGlobalFilter(globalFilterValue ?? globalFilter);
    }, [globalFilterValue]);

    if (loading)
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
            width: scroll ? "82.8vw" : "100%",
            overflowX: scroll ? "scroll" : "hidden",
          }}
        >
          <Table ref={tableRef} id={tableName}>
            <TableHeader
              style={{
                background: primary2Color
                  ? "var(--primary-2)"
                  : "var(--primary-1)",
              }}
            >
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          borderRadius: primary2Color ? "0px" : undefined,
                        }}
                      >
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
        {!disablePagination ? (
          <DataTablePagination
            size={size}
            handleTogglePage={handleTogglePage}
            currentPage={currentPage}
            totalPages={Math.ceil(size / defaultTableSize)}
            table={table}
          />
        ) : null}
      </>
    );
  },
);
