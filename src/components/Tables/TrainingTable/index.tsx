import { FilterButton } from "@/components/Table/Filters/FilterButton";
import { useTableParams } from "@/hooks/useTableParams";
import {
  TrainingStatusEnum,
  TrainingType,
  TrainingsType,
} from "@/interfaces/training.interface";
import { useGetAllTrainingsQuery } from "@/services/api/fetchApi";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter, useSearchParams } from "next/navigation";
import { RefObject, forwardRef, useEffect, useState } from "react";
import { Checkbox } from "../../Checkbox";
import FlatText from "../../FlatText";
import { DataTable } from "../../Table";
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
    const [unitOptions, setUnitsOptions] = useState<string[]>([]);
    const [trainersOptions, setTrainersOptions] = useState<string[]>([]);
    const [productsOptions, setProductsOptions] = useState<string[]>([]);

    const { get } = useSearchParams();

    const [currentPage, setCurrentPage] = useState<number>(
      get("page") ? Number(get("page")) : 1,
    );

    const { push } = useRouter();
    const { setParams } = useTableParams();

    const { data, isSuccess, isFetching, refetch } = useGetAllTrainingsQuery({
      page: currentPage,
      size: defaultTableSize,
    });

    const getFilterValues = (column: string) => {
      const paramsValue = get(column);
      if (paramsValue) {
        const paramsArray = paramsValue.split(",");
        table?.getColumn(column)?.setFilterValue(paramsArray);
      }
    };

    const handleTogglePage = async (page: number) => {
      setCurrentPage(page + 1);
    };

    const getAllFilters = () => {
      const units: string[] = [];
      const trainers: string[] = [];
      const products: string[] = [];

      trainings?.trainings.map(training => {
        if (!units.includes(training.trainingLocation)) {
          units.push(training.trainingLocation);
        }

        if (!trainers.includes(training.trainer)) {
          trainers.push(training.trainer);
        }

        if (!products.includes(training.productName)) {
          products.push(training.productName);
        }
      });

      setUnitsOptions(units);
      setTrainersOptions(trainers);
      setProductsOptions(products);
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

          return <FlatText text={status} type={status} />;
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
          return (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => push(`/trainings/${row.original.id}`)}
            >
              {row.getValue("trainingName")}
            </div>
          );
        },
      }),
      columnHelper.accessor("trainingLocation", {
        header: () => (
          <FilterButton
            title="Unidade/Site"
            column="trainingLocation"
            table={table}
            options={unitOptions}
          />
        ),
        cell: ({ row }) => {
          return <div>{row.getValue("trainingLocation")}</div>;
        },
        filterFn: (row, id, value) => {
          return value.length !== 0 ? value.includes(row.getValue(id)) : true;
        },
      }),
      columnHelper.accessor("trainer", {
        header: () => (
          <FilterButton
            title="Instrutor"
            column="trainer"
            table={table}
            options={trainersOptions}
          />
        ),
        cell: ({ row }) => {
          return <div>{row.getValue("trainer")}</div>;
        },
        filterFn: (row, id, value) => {
          return value.length !== 0 ? value.includes(row.getValue(id)) : true;
        },
      }),
      columnHelper.accessor("productName", {
        header: () => (
          <FilterButton
            title="Produto"
            column="productName"
            table={table}
            options={productsOptions}
          />
        ),
        cell: ({ row }) => {
          return <div>{row.getValue("productName")}</div>;
        },
        filterFn: (row, id, value) => {
          return value.length !== 0 ? value.includes(row.getValue(id)) : true;
        },
      }),
    ];

    useEffect(() => {
      setParams("page", String(currentPage));
      refetch();
    }, [currentPage]);

    useEffect(() => {
      getFilterValues("trainingLocation");
      getFilterValues("trainer");
      getFilterValues("trainingProduct");
    }, [table]);

    useEffect(() => {
      if (isSuccess) {
        setTrainings(data);
      }
    }, [isSuccess, isFetching]);

    useEffect(() => {
      if (trainings) {
        getAllFilters();
      }
    }, [trainings]);

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
          tableName="Treinamentos"
        />
      </section>
    );
  },
);
