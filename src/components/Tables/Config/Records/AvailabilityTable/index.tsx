import { SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { AvailabilityModal } from "@/components/Modals/AvailabilityCreate";
import { Switch } from "@/components/Switch";
import { DataTable } from "@/components/Table";
import { Actions } from "@/components/Tables/components/Actions";
import { StatusEnum } from "@/enums/status.enum";
import { useTableParams } from "@/hooks/useTableParams";
import {
  IAvailabilities,
  IAvailability,
} from "@/interfaces/availability.interface";
import {
  useCreateAvailabilityMutation,
  useDeleteAvaliabilityMutation,
  useGetAllAvailabilitiesQuery,
  useUpdateAvailabilityMutation,
} from "@/services/api/fetchApi";
import { formatTimeRange } from "@/utils/formatTimeRange";
import { Toast } from "@/utils/toast";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import styles from "../Table.module.scss";

interface TableProps {
  defaultTableSize: number;
  type: number;
}

export function AvailabilityTable({ defaultTableSize, type }: TableProps) {
  const [availabilities, setAvailabilities] = useState<IAvailabilities>();
  const [table, setTable] = useState<Table<any>>();

  const { get } = useSearchParams();
  const { setParams } = useTableParams();
  const [currentPage, setCurrentPage] = useState(
    get("page") ? Number(get("page")) : 1,
  );

  const { data, isSuccess, isFetching, refetch } = useGetAllAvailabilitiesQuery(
    {
      page: currentPage,
      size: defaultTableSize,
      orderBy: "createdAt",
      direction: "DESC",
    },
  );

  const [createAvailability] = useCreateAvailabilityMutation();
  const [updateAvailability] = useUpdateAvailabilityMutation();
  const [deleteAvailability] = useDeleteAvaliabilityMutation();

  const handleCreateItem = async (data: any) => {
    await createAvailability({ ...data, status: "ATIVO" });
    refetch();
    Toast("success", "Disponibilidade criada com sucesso!");
  };

  const handleUpdateItem = async (data: any) => {
    await updateAvailability(data);
    refetch();
    Toast("success", "Disponibilidade atualizada com sucesso!");
  };

  const handleDeleteItem = async (id: string) => {
    await deleteAvailability({ id });
    refetch();
    Toast("success", "Disponibilidade deletada com sucesso!");
  };

  const handleSwitchChange = (checked: boolean, rowIndex: number) => {
    const newItem = {
      id: "",
      status: checked ? "ATIVO" : "INATIVO",
    };

    const newItems = data!.availabilities.map((item, index) => {
      if (rowIndex === index) {
        newItem.id = String(item.id);

        return {
          ...item,
          status: checked ? ("ATIVO" as StatusEnum) : ("INATIVO" as StatusEnum),
        };
      }
      return item;
    });
    // quando a animação do switch terminar, atualiza o processo
    setTimeout(() => {
      updateAvailability(newItem);

      setAvailabilities({
        availabilities: newItems,
        totalCount: availabilities!.totalCount,
      });
    }, 100);
  };

  const handleTogglePage = (page: number) => {
    setCurrentPage(page + 1);
  };

  const downloadTableExcelHandler = () => {
    const columnHeaders = ["Status", "Disponibilidade", "Atualizado em"];

    const rows = table?.getRowModel().flatRows.map(row => row.original);

    if (rows && rows.length > 0) {
      const excelData = rows.map(row => ({
        status: row.status,
        availabilities: formatTimeRange(row),
        updatedAt: dayjs(row.updatedAt).format("DD/MM/YYYY"),
      }));

      downloadExcel({
        fileName: `Configurações - Cadastros - Disponibilidade`,
        sheet: `Configurações - Cadastros - Disponibilidade pag. ${currentPage}`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    }
  };

  const columnHelper = createColumnHelper<IAvailability>();
  const columns = [
    columnHelper.accessor("status", {
      header: "Status",
      cell: row => {
        return (
          <Switch
            checked={row.getValue() === "ATIVO" ? true : false}
            handleSwitchChange={checked => {
              handleSwitchChange(checked, row.row.index);
            }}
          />
        );
      },
    }),
    columnHelper.accessor(
      row => `${row.startDay} ${row.endDay} ${row.startHour} ${row.endHour}`,
      {
        header: "Disponibilidade",
        id: "availability",
        cell: row => {
          const values = String(row.getValue()).split(" ");
          const startDay = Number(values[0]);
          const endDay = Number(values[1]);
          const startHour = Number(values[2]);
          const endHour = Number(values[3]);

          const value = formatTimeRange({
            startDay,
            endDay,
            startHour,
            endHour,
          });

          return <div>{value}</div>;
        },
      },
    ),
    {
      header: "Ações",
      cell: (row: any) => {
        const id = String(row.row.original.id);

        const handleDeleteRow = () => {
          handleDeleteItem(id);
        };

        const handleEditRow = (data: any) => {
          handleUpdateItem({
            ...data,
            id: row.row.original.id,
            status: row.row.original.status,
          });
        };

        return (
          <Actions
            value={formatTimeRange(row.row.original)}
            handleDelete={handleDeleteRow}
            EditModal={
              <AvailabilityModal
                handleOnSubmit={handleEditRow}
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

  useEffect(() => {
    if (isSuccess) {
      setAvailabilities(data);
    }
  }, [isSuccess, isFetching]);

  useEffect(() => {
    refetch();
    setParams("page", String(currentPage));
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [type]);

  if (!availabilities) return;

  return (
    <section className={styles.container}>
      <div className={styles.container__buttons}>
        <Button
          buttonType="secondary"
          text="Exportar dados"
          icon={<SystemUpdate />}
          onClick={downloadTableExcelHandler}
        />

        <AvailabilityModal create handleOnSubmit={handleCreateItem} />
      </div>

      <DataTable
        columns={columns}
        currentPage={currentPage}
        data={availabilities.availabilities}
        defaultTableSize={defaultTableSize}
        handleTogglePage={handleTogglePage}
        setTable={setTable}
        size={availabilities.totalCount}
        loading={isFetching}
      />
    </section>
  );
}
