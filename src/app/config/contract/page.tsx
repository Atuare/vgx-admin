"use client";

import { Delete, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { ContractConfigModal } from "@/components/Modals/ContractsConfig";
import { DeleteModal } from "@/components/Modals/DeleteModal";
import { Switch } from "@/components/Switch";
import { DataTable } from "@/components/Table";
import { StatusEnum } from "@/enums/status.enum";
import { IContract, IContracts } from "@/interfaces/contract.interface";
import {
  useCreateContractMutation,
  useDeleteContractMutation,
  useGetAllContractsQuery,
  useUpdateContractMutation,
} from "@/services/api/fetchApi";
import { Toast } from "@/utils/toast";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import { ToastContainer } from "react-toastify";
import styles from "../LayoutConfig.module.scss";
dayjs.extend(utc);

interface ActionsProps {
  handleDelete: () => void;
  handleEdit: (data: any) => void;
  value: string;
  defaultValue: any;
}

const defaultTableSize = 5;

export default function ContractsConfigPage() {
  const [contracts, setContracts] = useState<IContracts>();
  const [table, setTable] = useState<Table<any>>();

  const { get } = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    get("page") ? Number(get("page")) : 1,
  );

  const {
    data: documentsData,
    isSuccess,
    isFetching,
    refetch,
  } = useGetAllContractsQuery({
    page: currentPage,
    size: defaultTableSize,
    orderBy: "createdAt",
    direction: "DESC",
  });

  const [deleteContract] = useDeleteContractMutation();
  const [createContract] = useCreateContractMutation();
  const [updateContract] = useUpdateContractMutation();

  const handleTogglePage = (page: number) => {
    setCurrentPage(page + 1);
  };

  const handleDeleteContract = async (id: string) => {
    await deleteContract({ id });
    refetch().then(() => Toast("success", "Contrato deletado com sucesso!"));
  };

  const handleCreateContract = async (data: any) => {
    await createContract(data);
    refetch().then(() => Toast("success", "Contrato criado com sucesso!"));
  };

  const handleUpdateContract = async (data: any) => {
    await updateContract(data);
    refetch().then(() => Toast("success", "Contrato atualizado com sucesso!"));
  };

  const handleSwitchChange = (checked: boolean, rowIndex: number) => {
    const newItem = {
      id: "",
      name: "",
      status: checked ? "ATIVO" : "INATIVO",
    };

    const newItems = contracts!.contracts.map((item, index) => {
      if (rowIndex === index) {
        newItem.id = String(item.id);
        newItem.name = item.name;

        return {
          ...item,
          status: checked ? ("ATIVO" as StatusEnum) : ("INATIVO" as StatusEnum),
        };
      }
      return item;
    });

    setTimeout(() => {
      updateContract(newItem);

      setContracts({
        contracts: newItems,
        totalCount: contracts!.totalCount,
      });
    }, 100);
  };

  const columnHelper = createColumnHelper<IContract>();
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
    columnHelper.accessor("name", {
      header: "Nome",
      cell: row => <div>{row.getValue()}</div>,
    }),
    columnHelper.accessor("description", {
      header: "Descrição",
      cell: row => <div>{row.getValue()}</div>,
    }),

    {
      header: "Ações",
      cell: (row: any) => {
        const id = String(row.row.original.id);
        const handleDeleteRow = () => {
          handleDeleteContract(id);
        };

        const handleEditRow = (data: any) => {
          handleUpdateContract({
            ...data,
            id: row.row.original.id,
            status: row.row.original.status,
          });
        };

        return (
          <Actions
            handleDelete={handleDeleteRow}
            handleEdit={handleEditRow}
            value={row.row.original.name}
            defaultValue={row.row.original}
          />
        );
      },
    },
    columnHelper.accessor(
      value => dayjs(value.updatedAt).format("DD/MM/YYYY HH:mm"),
      {
        header: "Atualizado em",
        cell: row => <div>{row.getValue()}</div>,
      },
    ),
  ];

  function downloadTableExcelHandler() {
    const columnHeaders = ["Status", "Nome", "Descrição", "Atualizado em"];

    const rows = table?.getRowModel().flatRows.map(row => row.original);

    if (rows && rows.length > 0) {
      const excelData = rows.map(row => ({
        status: row.status,
        name: row.name,
        description: row.description,
        updatedAt: dayjs(row.updatedAt).utc().format("DD/MM/YYYY"),
      }));

      downloadExcel({
        fileName: `Contrato Config`,
        sheet: `Contrato Config pag. ${currentPage}`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setContracts(documentsData);
    }
  }, [isSuccess, isFetching]);

  if (!contracts) return null;

  return (
    <div className={styles.container}>
      <section className={styles.container__actions}>
        <Button
          buttonType="secondary"
          text="Exportar dados"
          icon={<SystemUpdate />}
          onClick={downloadTableExcelHandler}
        />

        <ContractConfigModal handleOnSubmit={handleCreateContract} create />
      </section>

      <DataTable
        columns={columns}
        currentPage={currentPage}
        data={contracts?.contracts}
        defaultTableSize={defaultTableSize}
        handleTogglePage={handleTogglePage}
        setTable={setTable}
        size={contracts?.totalCount}
      />

      <ToastContainer />
    </div>
  );
}

function Actions({
  handleDelete,
  handleEdit,
  value,
  defaultValue,
}: ActionsProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
      }}
    >
      <DeleteModal handleOnDelete={handleDelete} name={value}>
        <IconButton buttonType="delete" icon={<Delete />} />
      </DeleteModal>

      <ContractConfigModal
        handleOnSubmit={handleEdit}
        defaultValue={defaultValue}
      />
    </div>
  );
}
