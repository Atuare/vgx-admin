import { SchedulingModal } from "@/components/Modals/InterviewsConfig/SchedulingModal";
import { DataTable } from "@/components/Table";
import { IScheduling } from "@/interfaces/configInterviews.interface";
import { convertDayOfWeek } from "@/utils/dates";
import { Toast } from "@/utils/toast";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Actions } from "../../components/Actions";

interface ISchedulingTableProps {
  defaultTableSize: number;
  setTable: (table: Table<any>) => void;
  schedulings: IScheduling[];
  handleChangeSchedulings: (data: IScheduling[]) => void;
}

export function SchedulingTable({
  defaultTableSize,
  setTable,
  schedulings,
  handleChangeSchedulings,
}: ISchedulingTableProps) {
  const { get } = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    get("page") ? Number(get("page")) : 1,
  );

  const handleTogglePage = (page: number) => {
    setCurrentPage(page + 1);
  };

  const handleDeleteHour = (id: string) => {
    const newSchedulings = schedulings.filter(
      scheduling => scheduling.id !== id,
    );
    handleChangeSchedulings(newSchedulings);
    Toast("success", "Horário removido com sucesso.");
  };

  const handleOnEditHour = (data: IScheduling, schedulingId: string) => {
    const newSchedulings = schedulings.map(scheduling => {
      if (scheduling.id === schedulingId) {
        return {
          ...scheduling,
          ...data,
          updatedAt: dayjs().toISOString(),
        };
      }
      return scheduling;
    });

    handleChangeSchedulings(newSchedulings);
    Toast("success", "Horário atualizado com sucesso.");
  };

  const columnHelper = createColumnHelper<IScheduling>();
  const columns = [
    columnHelper.accessor("date", {
      header: "Horário",
      cell: row => <div>{dayjs(row.getValue()).format("HH:mm")}</div>,
    }),
    columnHelper.accessor("schedulingLimit", {
      header: "Limite de Agendamentos",
      cell: row => <div>{row.getValue()}</div>,
    }),
    columnHelper.accessor("dayOfWeek", {
      header: "Dia da Semana",
      cell: row => <div>{convertDayOfWeek(row.getValue())}</div>,
    }),
    {
      id: "actions",
      header: "Ações",
      cell: (row: any) => {
        return (
          <Actions
            handleDelete={() => handleDeleteHour(row.row.original.id)}
            value={`o horário: ${dayjs(row.row.original.date).format("HH:mm")}`}
            EditModal={
              <SchedulingModal
                handleOnSubmit={data =>
                  handleOnEditHour(data, row.row.original.id)
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

  if (schedulings.length === 0)
    return <div style={{ margin: "0 auto" }}>Não há horários adicionados.</div>;

  return (
    <DataTable
      columns={columns}
      currentPage={currentPage}
      data={schedulings.slice(firstIndex, lastIndex)}
      defaultTableSize={defaultTableSize}
      handleTogglePage={handleTogglePage}
      setTable={setTable}
      size={schedulings.length}
    />
  );
}
