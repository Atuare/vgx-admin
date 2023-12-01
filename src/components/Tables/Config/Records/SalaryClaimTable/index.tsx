import { SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { SalaryClaimModal } from "@/components/Modals/SalaryClaimCreate";
import { Switch } from "@/components/Switch";
import { DataTable } from "@/components/Table";
import { Actions } from "@/components/Tables/components/Actions";
import { StatusEnum } from "@/enums/status.enum";
import { useTableParams } from "@/hooks/useTableParams";
import {
  ISalaryClaim,
  ISalaryClaims,
} from "@/interfaces/salaryClaim.interface";
import {
  useCreateSalaryClaimMutation,
  useDeleteSalaryClaimMutation,
  useGetAllSalaryClaimQuery,
  useUpdateSalaryClaimMutation,
} from "@/services/api/fetchApi";
import { formatCurrency } from "@/utils/formatCurrency";
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

export function SalaryClaimTable({ defaultTableSize, type }: TableProps) {
  const [salaryClaims, setSalaryClaims] = useState<ISalaryClaims>();
  const [table, setTable] = useState<Table<any>>();

  const { get } = useSearchParams();
  const { setParams } = useTableParams();
  const [currentPage, setCurrentPage] = useState(
    get("page") ? Number(get("page")) : 1,
  );

  const { data, isSuccess, isFetching, refetch } = useGetAllSalaryClaimQuery({
    page: currentPage,
    size: defaultTableSize,
    orderBy: "updatedAt",
    direction: "DESC",
  });

  const [createSalaryClaim] = useCreateSalaryClaimMutation();
  const [updateSalaryClaim] = useUpdateSalaryClaimMutation();
  const [deleteSalaryClaim] = useDeleteSalaryClaimMutation();

  const handleCreateItem = async (data: any) => {
    await createSalaryClaim({ ...data, status: "ATIVO" });
    refetch();
    Toast("success", "Pretensão salarial criada com sucesso!");
  };

  const handleUpdateItem = async (data: any) => {
    await updateSalaryClaim(data);
    refetch();
    Toast("success", "Pretensão salarial atualizada com sucesso!");
  };

  const handleDeleteItem = async (id: string) => {
    await deleteSalaryClaim({ id });
    refetch();
    Toast("success", "Pretensão salarial deletada com sucesso!");
  };

  const handleSwitchChange = (checked: boolean, rowIndex: number) => {
    const newItem = {
      id: "",
      status: checked ? "ATIVO" : "INATIVO",
    };

    const newItems = data!.salaryClaims.map((item, index) => {
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
      updateSalaryClaim(newItem);

      setSalaryClaims({
        salaryClaims: newItems,
        totalCount: salaryClaims!.totalCount,
      });
    }, 100);
  };

  const handleTogglePage = (page: number) => {
    setCurrentPage(page + 1);
  };

  const downloadTableExcelHandler = () => {
    const columnHeaders = ["Status", "Pretensão salarial", "Atualizado em"];

    const rows = table?.getRowModel().flatRows.map(row => row.original);

    if (rows && rows.length > 0) {
      const excelData = rows.map(row => ({
        status: row.status,
        salaryClaims: `${formatCurrency(row.fromAmount)} até ${formatCurrency(
          row.toAmount,
        )}`,
        updatedAt: dayjs(row.updatedAt).format("DD/MM/YYYY HH:mm:ss"),
      }));

      downloadExcel({
        fileName: `Configurações - Cadastros - Pretensão Salarial`,
        sheet: `Configurações - Cadastros - Pretensão Salarial pag. ${currentPage}`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    }
  };

  const columnHelper = createColumnHelper<ISalaryClaim>();
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
    columnHelper.accessor(row => `${row.fromAmount} ${row.toAmount}`, {
      header: "Pretensão salarial",
      id: "salaryClaim",
      cell: row => {
        const values = String(row.getValue()).split(" ");

        const firstValue = formatCurrency(values[0]);
        const secondValue = formatCurrency(values[1]);

        return (
          <div>
            De {firstValue} até {secondValue}
          </div>
        );
      },
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
            value="Prentensão Salarial"
            handleDelete={handleDeleteRow}
            EditModal={
              <SalaryClaimModal
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
      setSalaryClaims(data);
    }
  }, [isSuccess, isFetching]);

  useEffect(() => {
    refetch();
    setParams("page", String(currentPage));
  }, [currentPage]);

  if (!salaryClaims) return;

  return (
    <section className={styles.container}>
      <div className={styles.container__buttons}>
        <Button
          buttonType="secondary"
          text="Exportar dados"
          icon={<SystemUpdate />}
          onClick={downloadTableExcelHandler}
        />

        <SalaryClaimModal create handleOnSubmit={handleCreateItem} />
      </div>

      <DataTable
        columns={columns}
        currentPage={currentPage}
        data={salaryClaims.salaryClaims}
        defaultTableSize={defaultTableSize}
        handleTogglePage={handleTogglePage}
        setTable={setTable}
        size={salaryClaims.totalCount}
        loading={isFetching}
      />
    </section>
  );
}
