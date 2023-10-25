"use client";
import { Switch } from "@/components/Switch";
import { DataTable } from "@/components/Table";
import {
  IInterview,
  IInterviews,
} from "@/interfaces/configInterviews.interface";
import {
  useDeleteInterviewSettingMutation,
  useGetInterviewSettingsQuery,
  useUpdateInterviewSettingMutation,
} from "@/services/api/fetchApi";
import { Toast } from "@/utils/toast";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Actions } from "../../components/Actions";

const defaultTake = 15;

interface IHomeTableProps {
  table: Table<any> | undefined;
  setTable: (table: Table<any>) => void;
}

export function InterviewHomeTable({ setTable, table }: IHomeTableProps) {
  const [interviews, setInterviews] = useState<IInterviews>();

  const { get } = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    get("page") ? Number(get("page")) : 1,
  );

  const { data, isSuccess, isFetching, refetch } = useGetInterviewSettingsQuery(
    {},
  );
  const [updateInterview] = useUpdateInterviewSettingMutation();
  const [deleteInterview] = useDeleteInterviewSettingMutation();

  const handleTogglePage = (page: number) => {
    setCurrentPage(page + 1);
  };

  const handleDeleteInterview = (id: string) => {
    deleteInterview({ id }).then(res => {
      if ("error" in res) {
        Toast("error", "Erro ao deletar o agendamento de entrevista.");
      } else {
        refetch().then(() =>
          Toast("success", "Agendamento de entrevista deletado com sucesso."),
        );
      }
    });
  };

  const handleChangeStatus = (data: IInterview, status: boolean) => {
    const oldInterviews = interviews;

    const newItems = interviews!.data.map(item => {
      if (item.id === data.id) {
        return {
          ...item,
          status,
        };
      }
      return item;
    });

    setTimeout(() => {
      setInterviews({
        data: newItems,
        total: interviews!.total,
      });

      updateInterview({ ...data, status }).then(res => {
        if ("error" in res) {
          Toast("error", "Erro ao atualizar o status do agendamento.");
          setInterviews(oldInterviews);
        } else {
          refetch().then(() =>
            Toast("success", "Status do agendamento atualizado com sucesso."),
          );
        }
      });
    }, 100);
  };

  const columnHelper = createColumnHelper<IInterview>();
  const columns = [
    columnHelper.accessor("status", {
      header: "Status",
      cell: row => (
        <Switch
          checked={row.getValue()}
          handleSwitchChange={checked =>
            handleChangeStatus(row.row.original, checked)
          }
        />
      ),
    }),
    columnHelper.accessor("unitOrSite", {
      header: "Unidade",
      cell: row => <div>{row.getValue()}</div>,
    }),
    columnHelper.accessor("type", {
      header: "Tipo de entrevista",
      cell: row => (
        <div>{row.getValue() === "REMOTE" ? "Remoto" : "Presencial"}</div>
      ),
    }),
    columnHelper.accessor("limitTime", {
      header: "Hora limite",
      cell: row => <div>{dayjs(row.getValue()).format("HH:mm:ss")}</div>,
    }),
    columnHelper.accessor("availableDays", {
      id: "startDate",
      header: "Data Inicial",
      cell: row => <div>D+{row.getValue()}</div>,
    }),
    columnHelper.accessor("availableDays", {
      header: "Dias disponíveis",
      cell: row => <div>{row.getValue()}</div>,
    }),
    {
      id: "actions",
      header: "Ações",
      cell: (row: any) => {
        return (
          <Actions
            handleDelete={() => handleDeleteInterview(row.row.original.id)}
            value="essa entrevista"
            href={`/config/interviews/${row.row.original.id}`}
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

  useEffect(() => {
    refetch();
  }, [currentPage]);

  useEffect(() => {
    isSuccess && setInterviews(data);
  }, [isSuccess, isFetching]);

  if (!interviews) return;

  return (
    <DataTable
      columns={columns}
      currentPage={currentPage}
      data={interviews.data}
      defaultTableSize={defaultTake}
      handleTogglePage={handleTogglePage}
      setTable={setTable}
      size={interviews.total}
      loading={isFetching}
    />
  );
}
