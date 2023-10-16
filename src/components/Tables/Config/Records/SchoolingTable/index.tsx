import { SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { SchoolingModal } from "@/components/Modals/SchoolingCreate";
import { Switch } from "@/components/Switch";
import { DataTable } from "@/components/Table";
import { Actions } from "@/components/Tables/components/Actions";
import { StatusEnum } from "@/enums/status.enum";
import { useTableParams } from "@/hooks/useTableParams";
import { ISchooling, ISchoolings } from "@/interfaces/schooling.interface";
import {
  useCreateSchoolingMutation,
  useDeleteSchoolingMutation,
  useGetAllSchoolingsQuery,
  useUpdateSchoolingMutation,
} from "@/services/api/fetchApi";
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

export function SchoolingTable({ defaultTableSize, type }: TableProps) {
  const [schoolings, setSchoolings] = useState<ISchoolings>();
  const [table, setTable] = useState<Table<any>>();

  const { get } = useSearchParams();
  const { setParams } = useTableParams();
  const [currentPage, setCurrentPage] = useState(
    get("page") ? Number(get("page")) : 1,
  );

  const { data, isSuccess, isFetching, refetch } = useGetAllSchoolingsQuery({
    page: currentPage,
    size: defaultTableSize,
    orderBy: "createdAt",
    direction: "DESC",
  });

  const [createSchooling] = useCreateSchoolingMutation();
  const [updateSchooling] = useUpdateSchoolingMutation();
  const [deleteSchooling] = useDeleteSchoolingMutation();

  const handleCreateItem = async (data: any) => {
    await createSchooling({ ...data, status: "ATIVO" });
    refetch();
    Toast("success", "Escolaridade criada com sucesso!");
  };

  const handleUpdateItem = async (data: any) => {
    await updateSchooling(data);
    refetch();
    Toast("success", "Escolaridade atualizada com sucesso!");
  };

  const handleDeleteItem = async (id: string) => {
    await deleteSchooling({ id });
    refetch();
    Toast("success", "Escolaridade deletada com sucesso!");
  };

  const handleSwitchChange = (checked: boolean, rowIndex: number) => {
    const newItem = {
      id: "",
      status: checked ? "ATIVO" : "INATIVO",
    };

    const newItems = data!.schoolings.map((item, index) => {
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
      updateSchooling(newItem);

      setSchoolings({
        schoolings: newItems,
        totalCount: schoolings!.totalCount,
      });
    }, 100);
  };

  const handleTogglePage = (page: number) => {
    setCurrentPage(page + 1);
  };

  const downloadTableExcelHandler = () => {
    const columnHeaders = [
      "Status",
      "Escolaridade",
      "Informar curso",
      "Atualizado em",
    ];

    const rows = table?.getRowModel().flatRows.map(row => row.original);

    if (rows && rows.length > 0) {
      const excelData = rows.map(row => ({
        status: row.status,
        schooling: row.schoolingName,
        informCourse: row.informCourse ? "Sim" : "Não",
        updatedAt: dayjs(row.updatedAt).format("DD/MM/YYYY HH:mm:ss"),
      }));

      downloadExcel({
        fileName: `Configurações - Cadastros - Escolaridade`,
        sheet: `Configurações - Cadastros - Escolaridade pag. ${currentPage}`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    }
  };

  const columnHelper = createColumnHelper<ISchooling>();
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
    columnHelper.accessor("schoolingName", {
      header: "Escolaridade",
      cell: row => <div>{row.getValue()}</div>,
    }),
    columnHelper.accessor("informCourse", {
      header: "Escolaridade",
      cell: row => <div>{row.getValue() ? "Sim" : "Não"}</div>,
    }),
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
            value={row.row.original.schoolingName}
            handleDelete={handleDeleteRow}
            EditModal={
              <SchoolingModal
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
      setSchoolings(data);
    }
  }, [isSuccess, isFetching]);

  useEffect(() => {
    refetch();
    setParams("page", String(currentPage));
  }, [currentPage]);

  if (!schoolings) return;

  return (
    <section className={styles.container}>
      <div className={styles.container__buttons}>
        <Button
          buttonType="secondary"
          text="Exportar dados"
          icon={<SystemUpdate />}
          onClick={downloadTableExcelHandler}
        />

        <SchoolingModal create handleOnSubmit={handleCreateItem} />
      </div>

      <DataTable
        columns={columns}
        currentPage={currentPage}
        data={schoolings.schoolings}
        defaultTableSize={defaultTableSize}
        handleTogglePage={handleTogglePage}
        setTable={setTable}
        size={schoolings.totalCount}
        loading={isFetching}
      />
    </section>
  );
}
