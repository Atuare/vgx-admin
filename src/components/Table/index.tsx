"use client";

import {
  ColumnFiltersState,
  createColumnHelper,
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

import { useRouter, useSearchParams } from "next/navigation";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import { Switch } from "@/components/Switch";
import { FilterButton } from "@/components/Table/FilterButton";
import { StatusEnum } from "@/enums/status.enum";
import { useProcessTable } from "@/hooks/useProcessTable";
import { useProcesses } from "@/hooks/useProcesses";
import { ProcessType } from "@/interfaces/process.interface";
import {
  useGetAllRolesQuery,
  useGetAllUnitsQuery,
  useUpdateProcessMutation,
} from "@/services/api/fetchApi";
import { forwardRef, useEffect, useState } from "react";
import { DataTablePagination } from "./Pagination";

interface DataTableProps {
  data: ProcessType[];
  size: number;
  handlePageChange?: (page: number) => void;
  currentPage?: number;
  tableName: string;
}

export const DataTable = forwardRef<HTMLTableElement, DataTableProps>(
  function DataTable(props, ref) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [unitsOptions, setUnitsOptions] = useState<string[]>([]);
    const [rolesOptions, setRolesOptions] = useState<string[]>([]);

    const [updateProcess] = useUpdateProcessMutation();

    const { processes, setProcesses } = useProcesses();
    const { defaultTableSize } = useProcessTable();
    const { push } = useRouter();
    const { get } = useSearchParams();

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

    const handleSwitchChange = (checked: boolean, rowIndex: number) => {
      const newProcess = { id: "", status: checked ? "ATIVO" : "INATIVO" };

      const newProcesses = processes.processes.map((process, index) => {
        if (rowIndex === index) {
          newProcess.id = process.id;

          return {
            ...process,
            status: checked
              ? ("ATIVO" as StatusEnum)
              : ("INATIVO" as StatusEnum),
          };
        }

        return process;
      });

      // quando a animação do switch terminar, atualiza o processo
      setTimeout(() => {
        updateProcess(newProcess);

        setProcesses({
          processes: newProcesses,
          totalCount: processes.totalCount,
        });
      }, 100);
    };

    useEffect(() => {
      if (unitsSuccess && rolesSuccess) {
        setRolesOptions(roles.roles.map(role => role.roleText));
        setUnitsOptions(units.units.map(unit => unit.unitName));
      }
    }, [unitsSuccess, rolesSuccess]);

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

    const data = props.data;

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onColumnFiltersChange: setColumnFilters,
      getFilteredRowModel: getFilteredRowModel(),
      state: {
        columnFilters,
      },
      pageCount: Math.round(props.size / defaultTableSize),
    });

    const getFilterValues = (column: string) => {
      const paramsValue = get(column);
      if (paramsValue) {
        const paramsArray = paramsValue.split(",");
        table.getColumn(column)?.setFilterValue(paramsArray);
      }
    };

    useEffect(() => {
      getFilterValues("role_roleText");
      getFilterValues("unit_unitName");
    }, []);

    return (
      <>
        <Table id={props.tableName} ref={ref}>
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <DataTablePagination size={props.size} />
      </>
    );
  },
);

// export function DataTabl2e({
//   data,
//   size,
//   handlePageChange,
//   tableName,
// }: DataTableProps) {
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [unitsOptions, setUnitsOptions] = useState<string[]>([]);
//   const [rolesOptions, setRolesOptions] = useState<string[]>([]);

//   const [updateProcess] = useUpdateProcessMutation();

//   const { processes, setProcesses } = useProcesses();
//   const { defaultTableSize } = useProcessTable();
//   const { push } = useRouter();
//   const { get } = useSearchParams();

//   const { data: units, isSuccess: unitsSuccess } = useGetAllUnitsQuery({
//     page: 1,
//     size: 9999,
//   });
//   const { data: roles, isSuccess: rolesSuccess } = useGetAllRolesQuery({
//     page: 1,
//     size: 9999,
//   });
//   const columnHelper = createColumnHelper<ProcessType>();

//   const handleGoDataPage = (rowIndex: number) => {
//     processes.processes.map((process, index) => {
//       if (rowIndex === index) {
//         push(`/process/${process.id}`);
//       }
//     });
//   };

//   const handleSwitchChange = (checked: boolean, rowIndex: number) => {
//     const newProcess = { id: "", status: checked ? "ATIVO" : "INATIVO" };

//     const newProcesses = processes.processes.map((process, index) => {
//       if (rowIndex === index) {
//         newProcess.id = process.id;

//         return {
//           ...process,
//           status: checked ? ("ATIVO" as StatusEnum) : ("INATIVO" as StatusEnum),
//         };
//       }

//       return process;
//     });

//     // quando a animação do switch terminar, atualiza o processo
//     setTimeout(() => {
//       updateProcess(newProcess);

//       setProcesses({
//         processes: newProcesses,
//         totalCount: processes.totalCount,
//       });
//     }, 100);
//   };

//   useEffect(() => {
//     if (unitsSuccess && rolesSuccess) {
//       setRolesOptions(roles.roles.map(role => role.roleText));
//       setUnitsOptions(units.units.map(unit => unit.unitName));
//     }
//   }, [unitsSuccess, rolesSuccess]);

//   const columns = [
//     columnHelper.accessor("status", {
//       header: "Status",
//       cell: ({ row }) => {
//         return (
//           <Switch
//             checked={row.getValue("status") === "ATIVO" ? true : false}
//             handleSwitchChange={checked => {
//               handleSwitchChange(checked, row.index);
//             }}
//           />
//         );
//       },
//     }),
//     columnHelper.accessor("limitCandidates", {
//       header: "Lim. Candidaturas",
//       cell: ({ row }) => (
//         <div>
//           {row.getValue("limitCandidates")
//             ? row.getValue("limitCandidates")
//             : "-"}
//         </div>
//       ),
//     }),
//     columnHelper.accessor("startDate", {
//       header: "Data início",
//       cell: ({ row }) => {
//         return (
//           <div>
//             {row.getValue("startDate")
//               ? dayjs(row.getValue("startDate")).utc().format("DD/MM/YYYY")
//               : "-"}
//           </div>
//         );
//       },
//     }),

//     columnHelper.accessor("endDate", {
//       header: "Data fim",
//       cell: ({ row }) => (
//         <div>
//           {row.getValue("endDate")
//             ? dayjs(row.getValue("endDate")).utc().format("DD/MM/YYYY")
//             : "-"}
//         </div>
//       ),
//     }),

//     columnHelper.accessor("role.roleText", {
//       header: () => (
//         <FilterButton
//           title="Processo/Cargo"
//           table={table}
//           options={rolesOptions}
//           column="role_roleText"
//         />
//       ),
//       cell: row => (
//         <div
//           style={{ cursor: "pointer" }}
//           onClick={() => handleGoDataPage(row.row.index)}
//         >
//           {row.getValue() ? row.getValue() : "-"}
//         </div>
//       ),
//       filterFn: (row, id, value) => {
//         return value.length !== 0 ? value.includes(row.getValue(id)) : true;
//       },
//     }),

//     columnHelper.accessor("unit.unitName", {
//       header: () => (
//         <FilterButton
//           title="Unidade/Site"
//           table={table}
//           options={unitsOptions}
//           column="unit_unitName"
//         />
//       ),
//       cell: row => <div>{row.getValue() ? row.getValue() : "-"}</div>,
//       filterFn: (row, id, value) => {
//         return value.length !== 0 ? value.includes(row.getValue(id)) : true;
//       },
//     }),
//   ];

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     onColumnFiltersChange: setColumnFilters,
//     getFilteredRowModel: getFilteredRowModel(),
//     state: {
//       columnFilters,
//     },
//     pageCount: Math.round(size / defaultTableSize),
//   });

//   const getFilterValues = (column: string) => {
//     const paramsValue = get(column);
//     if (paramsValue) {
//       const paramsArray = paramsValue.split(",");
//       table.getColumn(column)?.setFilterValue(paramsArray);
//     }
//   };

//   useEffect(() => {
//     getFilterValues("role_roleText");
//     getFilterValues("unit_unitName");
//   }, []);

//   return (
//     <>
//       <Table id={tableName}>
//         <TableHeader>
//           {table.getHeaderGroups().map(headerGroup => (
//             <TableRow key={headerGroup.id}>
//               {headerGroup.headers.map(header => {
//                 return (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext(),
//                         )}
//                   </TableHead>
//                 );
//               })}
//             </TableRow>
//           ))}
//         </TableHeader>
//         <TableBody>
//           {table.getRowModel().rows?.length ? (
//             table.getRowModel().rows.map(row => (
//               <TableRow key={row.id}>
//                 {row.getVisibleCells().map(cell => (
//                   <TableCell key={cell.id}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={columns.length} className="h-24 text-center">
//                 Sem resultados.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//       <DataTablePagination size={size} />
//     </>
//   );
// }
