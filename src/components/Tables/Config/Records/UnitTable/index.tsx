import { SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { UnitModal } from "@/components/Modals/UnitCreate";
import { Switch } from "@/components/Switch";
import { DataTable } from "@/components/Table";
import { Actions } from "@/components/Tables/components/Actions";
import { StatusEnum } from "@/enums/status.enum";
import { useTableParams } from "@/hooks/useTableParams";
import { IUnit, IUnits } from "@/interfaces/unit.interface";
import {
  useCreateUnitMutation,
  useDeleteUnitMutation,
  useGetAllUnitsQuery,
  useUpdateUnitMutation,
} from "@/services/api/fetchApi";
import { Toast } from "@/utils/toast";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import styles from "../Table.module.scss";

interface UnitTableProps {
  defaultTableSize: number;
  type: number;
}

export function UnitTable({ defaultTableSize, type }: UnitTableProps) {
  const [units, setUnits] = useState<IUnits>();
  const [table, setTable] = useState<Table<any>>();

  const { get } = useSearchParams();
  const { setParams } = useTableParams();
  const [currentPage, setCurrentPage] = useState(
    get("page") ? Number(get("page")) : 1,
  );

  const { data, isSuccess, isFetching, refetch } = useGetAllUnitsQuery({
    page: currentPage,
    size: defaultTableSize,
    orderBy: "updatedAt",
    direction: "DESC",
  });

  const [createUnit] = useCreateUnitMutation();
  const [updateUnit] = useUpdateUnitMutation();
  const [deleteUnit] = useDeleteUnitMutation();

  const handleCreateItem = async (data: any) => {
    await createUnit({ ...data, status: "ATIVO" });
    refetch();
    Toast("success", "Unidade criada com sucesso!");
  };

  const handleUpdateItem = async (data: any) => {
    await updateUnit(data);
    refetch();
    Toast("success", "Unidade atualizada com sucesso!");
  };

  const handleDeleteItem = async (id: string) => {
    await deleteUnit({ id });
    refetch();
    Toast("success", "Unidade deletada com sucesso!");
  };

  const handleSwitchChange = (checked: boolean, rowIndex: number) => {
    const newItem = {
      id: "",
      status: checked ? "ATIVO" : "INATIVO",
    };

    const newItems = data!.units.map((item, index) => {
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
      updateUnit(newItem);

      setUnits({
        units: newItems,
        totalCount: units!.totalCount,
      });
    }, 100);
  };

  const handleTogglePage = (page: number) => {
    setCurrentPage(page + 1);
  };

  const downloadTableExcelHandler = () => {
    const columnHeaders = [
      "Status",
      "Sigla",
      "Nome",
      "Endereço",
      "Atualizado em",
    ];

    const rows = table?.getRowModel().flatRows.map(row => row.original);

    if (rows && rows.length > 0) {
      const excelData = rows.map(row => ({
        status: row.status,
        acronym: row.unitAcronym,
        name: row.unitName,
        address: row.unitAddress,
        updatedAt: dayjs(row.updatedAt).format("DD/MM/YYYY HH:mm:ss"),
      }));

      downloadExcel({
        fileName: `Configurações - Cadastros`,
        sheet: `Configurações - Cadastros pag. ${currentPage}`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    }
  };

  const columnHelper = createColumnHelper<IUnit>();
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
    columnHelper.accessor("unitAcronym", {
      header: "Sigla",
      cell: row => <div>{row.getValue()}</div>,
    }),
    columnHelper.accessor("unitName", {
      header: "Nome",
      cell: row => <div>{row.getValue()}</div>,
    }),
    columnHelper.accessor("unitAddress", {
      header: "Endereço",
      cell: row => <div>{row.getValue()}</div>,
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
            value={row.row.original.unitName}
            handleDelete={handleDeleteRow}
            EditModal={
              <UnitModal
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
      setUnits(data);
    }
  }, [isSuccess, isFetching]);

  useEffect(() => {
    refetch();
    setParams("page", String(currentPage));
  }, [currentPage]);

  if (!units) return;

  return (
    <section className={styles.container}>
      <div className={styles.container__buttons}>
        <Button
          buttonType="secondary"
          text="Exportar dados"
          icon={<SystemUpdate />}
          onClick={downloadTableExcelHandler}
        />

        <UnitModal create handleOnSubmit={handleCreateItem} />
      </div>

      <DataTable
        columns={columns}
        currentPage={currentPage}
        data={units.units}
        defaultTableSize={defaultTableSize}
        handleTogglePage={handleTogglePage}
        setTable={setTable}
        size={units.totalCount}
        loading={isFetching}
      />
    </section>
  );
}
