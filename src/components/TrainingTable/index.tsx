import { useTableParams } from "@/hooks/useTableParams";
import {
  TrainingStatusEnum,
  TrainingType,
  TrainingsType,
} from "@/interfaces/training.interface";
import { useGetAllTrainingsQuery } from "@/services/api/fetchApi";
import { getAllTrainings } from "@/utils/training";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter, useSearchParams } from "next/navigation";
import { RefObject, forwardRef, useEffect, useState } from "react";
import { Checkbox } from "../Checkbox";
import FlatText from "../FlatText";
import { DataTable } from "../Table";
import styles from "./TrainingTable.module.scss";
dayjs.extend(utc);

interface ProcessTableProps {
  globalFilter?: string;
  tableRef?: RefObject<HTMLButtonElement>;
}

const defaultTableSize = 5;

// eslint-disable-next-line react/display-name
export const TrainingTable = forwardRef<HTMLButtonElement, ProcessTableProps>(
  (props, ref) => {
    const [table, setTable] = useState<Table<any>>();
    const [trainings, setTrainings] = useState<TrainingsType>();

    const { get } = useSearchParams();

    const [currentPage, setCurrentPage] = useState<number>(
      get("page") ? Number(get("page")) : 1,
    );

    const { push } = useRouter();
    const { setParams } = useTableParams();

    const { data, isSuccess } = useGetAllTrainingsQuery({
      page: currentPage,
      size: 5,
    });

    const getFilterValues = (column: string) => {
      const paramsValue = get(column);
      if (paramsValue) {
        const paramsArray = paramsValue.split(",");
        table?.getColumn(column)?.setFilterValue(paramsArray);
      }
    };

    const handleTogglePage = async (page: number) => {
      const data = await getAllTrainings(page + 1, defaultTableSize);

      setTrainings(data);
      setCurrentPage(page + 1);
    };

    const columnHelper = createColumnHelper<TrainingType>();

    const columns = [
      columnHelper.accessor("id", {
        id: "select",
        header: "",
        cell: ({ row }) => (
          <Checkbox
            {...{
              isActive: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              onChangeCheckbox: () => row?.toggleSelected(),
            }}
            iconType="outline"
            style={{ padding: 0, transform: "translateY(-2px)" }}
          />
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => {
          const rowStatusValue = row.getValue("status");
          const status =
            TrainingStatusEnum[
              rowStatusValue as keyof typeof TrainingStatusEnum
            ];

          const statusBackgroundColors: Record<TrainingStatusEnum, string> = {
            [TrainingStatusEnum.CONCLUIDO]: "var(-suceed)",
            [TrainingStatusEnum.EM_ANDAMENTO]: "var(--attention)",
            [TrainingStatusEnum.CANCELADO]: "var(--error)",
            [TrainingStatusEnum.SUSPENSO]: "var(--secondary-7)",
          };

          return (
            <FlatText
              text={status}
              styleProps={{
                backgroundColor: statusBackgroundColors[status],
              }}
            />
          );
        },
      }),
      columnHelper.accessor("participantLimit", {
        header: "Quantidade",
        cell: ({ row }) => {
          return <div>{row.getValue("participantLimit")}</div>;
        },
      }),
      columnHelper.accessor("trainingName", {
        header: "Nome",
        cell: ({ row }) => {
          return <div>{row.getValue("trainingName")}</div>;
        },
      }),
      columnHelper.accessor("trainingLocation", {
        header: "Unidade/Site",
        cell: ({ row }) => {
          return <div>{row.getValue("trainingLocation")}</div>;
        },
      }),
      columnHelper.accessor("trainer", {
        header: "Instrutor",
        cell: ({ row }) => {
          return <div>{row.getValue("trainer")}</div>;
        },
      }),
      columnHelper.accessor("productName", {
        header: "Produto",
        cell: ({ row }) => {
          return <div>{row.getValue("productName")}</div>;
        },
      }),
    ];

    useEffect(() => {
      setParams("page", String(currentPage));
    }, [currentPage]);

    useEffect(() => {
      if (isSuccess) {
        console.log(data);
        setTrainings(data);
      }
    }, [isSuccess]);

    if (!trainings) return null;

    return (
      <section className={styles.process__list}>
        <DataTable
          data={trainings.trainings}
          size={trainings.totalCount}
          columns={columns}
          setTable={setTable}
          ref={ref}
          defaultTableSize={defaultTableSize}
          currentPage={currentPage}
          handleTogglePage={handleTogglePage}
          globalFilterValue={props.globalFilter}
          tableName="Processos"
        />
      </section>
    );
  },
);
