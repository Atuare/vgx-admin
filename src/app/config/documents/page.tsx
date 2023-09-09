"use client";

import { Delete, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { DeleteModal } from "@/components/DeleteModal";
import { IconButton } from "@/components/IconButton";
import { DocumentsConfigModal } from "@/components/Modals/DocumentsConfig";
import { Switch } from "@/components/Switch";
import { DataTable } from "@/components/Table";
import { StatusEnum } from "@/enums/status.enum";
import { IDocument, IDocuments } from "@/interfaces/document.interface";
import {
  useCreateDocumentMutation,
  useDeleteDocumentMutation,
  useGetAllDocumentsQuery,
  useUpdateDocumentMutation,
} from "@/services/api/fetchApi";
import { getAllDocuments } from "@/utils/documents";
import { Toast } from "@/utils/toast";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import { ToastContainer } from "react-toastify";
import styles from "./DocumentsConfig.module.scss";
dayjs.extend(utc);

interface ActionsProps {
  handleDelete: () => void;
  handleEdit: (data: any) => void;
  value: string;
  defaultValue: any;
}

const defaultTableSize = 5;

export default function DocumentsConfigPage() {
  const [documents, setDocuments] = useState<IDocuments>();
  const [table, setTable] = useState<Table<any>>();

  const { get } = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    get("page") ? Number(get("page")) : 1,
  );

  const {
    data: documentsData,
    isSuccess,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllDocumentsQuery({
    page: currentPage,
    size: defaultTableSize,
  });

  const [deleteDocument] = useDeleteDocumentMutation();
  const [createDocument] = useCreateDocumentMutation();
  const [updateDocument] = useUpdateDocumentMutation();

  const getDocuments = async (page: number) => {
    const data = await getAllDocuments(page, defaultTableSize);
    setDocuments(data);
  };

  const handleTogglePage = (page: number) => {
    setCurrentPage(page + 1);
    getDocuments(page + 1);
  };

  const handleDeleteDocument = async (id: string) => {
    await deleteDocument({ id });
    refetch();
    Toast("success", "Documento deletado com sucesso!");
  };

  const handleCreateDocument = async (data: any) => {
    await createDocument(data);
    refetch();
    Toast("success", "Documento criado com sucesso!");
  };

  const handleUpdateDocument = async (data: any) => {
    await updateDocument(data);
    refetch();
    Toast("success", "Documento atualizado com sucesso!");
  };

  const handleSwitchChange = (checked: boolean, rowIndex: number) => {
    const newItem = {
      id: "",
      name: "",
      status: checked ? "ATIVO" : "INATIVO",
    };

    const newItems = documents!.documents.map((item, index) => {
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
      updateDocument(newItem);

      setDocuments({
        documents: newItems,
        totalCount: documents!.totalCount,
      });
    }, 100);
  };

  const columnHelper = createColumnHelper<IDocument>();
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
      header: "Documento",
      cell: row => <div>{row.getValue()}</div>,
    }),
    columnHelper.accessor("mandatory", {
      header: "Obrigatório",
      cell: row => <div>{row.getValue() ? "SIM" : "NÃO"}</div>,
    }),
    columnHelper.accessor(
      row => `${row.man} ${row.eighteenYears} ${row.married} ${row.childrens}`,
      {
        header: "Critérios",
        id: "availability",
        cell: row => {
          const values = String(row.getValue()).split(" ");
          const man = Number(values[0]);
          const eighteenYears = Number(values[1]);
          const married = Number(values[2]);
          const childrens = Number(values[3]);

          return (
            <div
              style={{
                margin: "0 auto",
                maxWidth: "192px",
                maxHeight: "42px",
                overflowY: "scroll",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <p>Homem: {man ? "Sim" : "Não"}</p>
              <p>Maioridade: {eighteenYears ? "Sim" : "Não"}</p>
              <p>Casado: {married ? "Sim" : "Não"}</p>
              <p>Filhos: {childrens ? "Sim" : "Não"}</p>
            </div>
          );
        },
      },
    ),
    {
      header: "Ações",
      cell: (row: any) => {
        const id = String(row.row.original.id);
        const handleDeleteRow = () => {
          handleDeleteDocument(id);
        };

        const handleEditRow = (data: any) => {
          handleUpdateDocument({
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
        cell: row => (
          <div>{dayjs(row.getValue()).format("DD/MM/YYYY HH:mm")}</div>
        ),
      },
    ),
  ];

  function downloadTableExcelHandler() {
    const selectedRows = table
      ?.getSelectedRowModel()
      .flatRows.map(row => row.original);

    const columnHeaders = [
      "Status",
      "Documento",
      "Obrigatório",
      "Critérios",
      "Atualizado em",
    ];

    if (selectedRows && selectedRows.length > 0) {
      const excelData = selectedRows.map(row => ({
        status: row.status,
        document: row.name,
        required: row.mandatory ? "SIM" : "NÃO",
        criteria: `Homem: ${row.man ? "Sim" : "Não"}\n Maioridade: ${
          row.eighteenYears ? "Sim" : "Não"
        }\nCasado: ${row.married ? "Sim" : "Não"}\nFilhos: ${
          row.childrens ? "Sim" : "Não"
        }`,
        updatedAt: dayjs(row.updatedAt).utc().format("DD/MM/YYYY"),
      }));

      downloadExcel({
        fileName: `Documento Config`,
        sheet: `Documento Config pag. ${currentPage}`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    } else {
      const rows = table?.getRowModel().flatRows.map(row => row.original);

      if (rows && rows.length > 0) {
        const excelData = rows.map(row => ({
          status: row.status,
          document: row.name,
          required: row.mandatory ? "SIM" : "NÃO",
          criteria: `Homem: ${row.man ? "Sim" : "Não"}\n Maioridade: ${
            row.eighteenYears ? "Sim" : "Não"
          }\nCasado: ${row.married ? "Sim" : "Não"}\nFilhos: ${
            row.childrens ? "Sim" : "Não"
          }`,
          updatedAt: dayjs(row.updatedAt).utc().format("DD/MM/YYYY"),
        }));

        downloadExcel({
          fileName: `Documento Config`,
          sheet: `Documento Config pag. ${currentPage}`,
          tablePayload: {
            header: columnHeaders,
            body: excelData,
          },
        });
      }
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setDocuments(documentsData);
    }
  }, [isSuccess, isFetching]);

  if (!documents) return null;

  return (
    <div className={styles.documents}>
      <section className={styles.documents__actions}>
        <Button
          buttonType="secondary"
          text="Exportar dados"
          icon={<SystemUpdate />}
          onClick={downloadTableExcelHandler}
        />

        <DocumentsConfigModal handleOnSubmit={handleCreateDocument} create />
      </section>

      <DataTable
        columns={columns}
        currentPage={currentPage}
        data={documents?.documents}
        defaultTableSize={defaultTableSize}
        handleTogglePage={handleTogglePage}
        setTable={setTable}
        size={documents?.totalCount}
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

      <DocumentsConfigModal
        handleOnSubmit={handleEdit}
        defaultValue={defaultValue}
      />
    </div>
  );
}
