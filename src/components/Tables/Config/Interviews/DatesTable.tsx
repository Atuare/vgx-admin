import { DatesModal } from "@/components/Modals/InterviewsConfig/DatesModal";
import { DataTable } from "@/components/Table";
import { IDate } from "@/interfaces/configInterviews.interface";
import { Toast } from "@/utils/toast";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Actions } from "../../components/Actions";

interface IDatesTableProps {
  defaultTableSize: number;
  setTable: (table: Table<any>) => void;
  dates: IDate[];
  handleChangeDates: (data: IDate[]) => void;
}

export function DatesTable({
  defaultTableSize,
  setTable,
  dates,
  handleChangeDates,
}: IDatesTableProps) {
  const { get } = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    get("page") ? Number(get("page")) : 1,
  );

  const handleTogglePage = (page: number) => {
    setCurrentPage(page + 1);
  };

  const handleDeleteDate = (id: string) => {
    const newDates = dates.filter(date => date.id !== id);
    handleChangeDates(newDates);
    Toast("success", "Data removida com sucesso.");
  };

  const handleOnEditDate = (data: IDate, dateId: string) => {
    const newDates = dates.map(date => {
      if (date.id === dateId) {
        return {
          ...date,
          ...data,
          updatedAt: dayjs().toISOString(),
        };
      }
      return date;
    });

    handleChangeDates(newDates);
    Toast("success", "Data atualizada com sucesso.");
  };

  const columnHelper = createColumnHelper<IDate>();
  const columns = [
    columnHelper.accessor("date", {
      header: "Data",
      cell: row => <div>{dayjs(row.getValue()).format("DD/MM/YYYY")}</div>,
    }),
    columnHelper.accessor("description", {
      header: "Descrição",
      cell: row => <div>{row.getValue()}</div>,
    }),
    {
      id: "actions",
      header: "Ações",
      cell: (row: any) => {
        return (
          <Actions
            handleDelete={() => handleDeleteDate(row.row.original.id)}
            value={`a data: ${dayjs(row.row.original.date).format(
              "DD/MM/YYYY",
            )}`}
            EditModal={
              <DatesModal
                handleOnSubmit={data =>
                  handleOnEditDate(data, row.row.original.id)
                }
                defaultValue={row.row.original}
              />
            }
          />
        );
      },
    },
    columnHelper.accessor("updatedAt", {
      header: "Atualizado em",
      cell: row => (
        <div>{dayjs(row.getValue()).format("DD/MM/YYYY HH:mm:ss")}</div>
      ),
    }),
  ];

  const firstIndex = (currentPage - 1) * defaultTableSize;
  const lastIndex = firstIndex + defaultTableSize;

  if (dates.length === 0)
    return <div style={{ margin: "0 auto" }}>Não há datas adicionadas.</div>;

  return (
    <DataTable
      columns={columns}
      currentPage={currentPage}
      data={dates.slice(firstIndex, lastIndex)}
      defaultTableSize={defaultTableSize}
      handleTogglePage={handleTogglePage}
      setTable={setTable}
      size={dates.length}
    />
  );
}
