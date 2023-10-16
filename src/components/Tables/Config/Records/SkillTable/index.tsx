import { SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { SkillModal } from "@/components/Modals/SkillCreate";
import { Switch } from "@/components/Switch";
import { DataTable } from "@/components/Table";
import { Actions } from "@/components/Tables/components/Actions";
import { StatusEnum } from "@/enums/status.enum";
import { useTableParams } from "@/hooks/useTableParams";
import { ISkill, ISkills } from "@/interfaces/skill.interface";
import {
  useCreateSkillMutation,
  useDeleteSkillMutation,
  useGetAllSkillsQuery,
  useUpdateSkillMutation,
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

export function SkillTable({ defaultTableSize, type }: TableProps) {
  const [skills, setSkills] = useState<ISkills>();
  const [table, setTable] = useState<Table<any>>();

  const { get } = useSearchParams();
  const { setParams } = useTableParams();
  const [currentPage, setCurrentPage] = useState(
    get("page") ? Number(get("page")) : 1,
  );

  const { data, isSuccess, isFetching, refetch } = useGetAllSkillsQuery({
    page: currentPage,
    size: defaultTableSize,
    orderBy: "createdAt",
    direction: "DESC",
  });

  const [createSkill] = useCreateSkillMutation();
  const [updateSkill] = useUpdateSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();

  const handleCreateItem = async (data: any) => {
    await createSkill({ ...data, status: "ATIVO" });
    refetch();
    Toast("success", "Habilidade criada com sucesso!");
  };

  const handleUpdateItem = async (data: any) => {
    await updateSkill(data);
    refetch();
    Toast("success", "Habilidade atualizada com sucesso!");
  };

  const handleDeleteItem = async (id: string) => {
    await deleteSkill({ id });
    refetch();
    Toast("success", "Habilidade deletada com sucesso!");
  };

  const handleSwitchChange = (checked: boolean, rowIndex: number) => {
    const newItem = {
      id: "",
      status: checked ? "ATIVO" : "INATIVO",
    };

    const newItems = data!.skills.map((item, index) => {
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
      updateSkill(newItem);

      setSkills({
        skills: newItems,
        totalCount: skills!.totalCount,
      });
    }, 100);
  };

  const handleTogglePage = (page: number) => {
    setCurrentPage(page + 1);
  };

  const downloadTableExcelHandler = () => {
    const columnHeaders = ["Status", "Habilidade", "Atualizado em"];

    const rows = table?.getRowModel().flatRows.map(row => row.original);

    if (rows && rows.length > 0) {
      const excelData = rows.map(row => ({
        status: row.status,
        skill: row.skillText,
        updatedAt: dayjs(row.updatedAt).format("DD/MM/YYYY HH:mm:ss"),
      }));

      downloadExcel({
        fileName: `Configurações - Cadastros - Habilidade`,
        sheet: `Configurações - Cadastros - Habilidade pag. ${currentPage}`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    }
  };

  const columnHelper = createColumnHelper<ISkill>();
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
    columnHelper.accessor("skillText", {
      header: "Habilidade",
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
            value={row.row.original.skillText}
            handleDelete={handleDeleteRow}
            EditModal={
              <SkillModal
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
      setSkills(data);
    }
  }, [isSuccess, isFetching]);

  useEffect(() => {
    refetch();
    setParams("page", String(currentPage));
  }, [currentPage]);

  if (!skills) return;

  return (
    <section className={styles.container}>
      <div className={styles.container__buttons}>
        <Button
          buttonType="secondary"
          text="Exportar dados"
          icon={<SystemUpdate />}
          onClick={downloadTableExcelHandler}
        />

        <SkillModal create handleOnSubmit={handleCreateItem} />
      </div>

      <DataTable
        columns={columns}
        currentPage={currentPage}
        data={skills.skills}
        defaultTableSize={defaultTableSize}
        handleTogglePage={handleTogglePage}
        setTable={setTable}
        size={skills.totalCount}
        loading={isFetching}
      />
    </section>
  );
}
