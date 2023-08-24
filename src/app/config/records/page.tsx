"use client";
import { AddCircle, Delete, EditSquare, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { Switch } from "@/components/Switch";
import { DataTable } from "@/components/Table";
import { StatusEnum } from "@/enums/status.enum";
import { useTableParams } from "@/hooks/useTableParams";
import { IAvailability } from "@/interfaces/availability.interface";
import { IRole } from "@/interfaces/role.interface";
import { ISalaryClaim } from "@/interfaces/salaryClaim.interface";
import { ISchooling } from "@/interfaces/schooling.interface";
import { ISkill } from "@/interfaces/skill.interface";
import { IUnit } from "@/interfaces/unit.interface";
import {
  useUpdateAvailabilityMutation,
  useUpdateRoleMutation,
  useUpdateSalaryClaimMutation,
  useUpdateSchoolingMutation,
  useUpdateSkillMutation,
  useUpdateUnitMutation,
} from "@/services/api/fetchApi";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatTimeRange } from "@/utils/formatTimeRange";
import {
  getAllAvailabilities,
  getAllRoles,
  getAllSalaryClaim,
  getAllSchoolings,
  getAllSkills,
  getAllUnits,
} from "@/utils/records";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useSearchParams } from "next/navigation";
import { HTMLAttributes, ReactNode, useEffect, useState } from "react";
import ReactLoading from "react-loading";
import styles from "./Records.module.scss";
dayjs.extend(utc);

interface IconButtonProps extends HTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  buttonType: "delete" | "edit";
}

const unitColumn = createColumnHelper<IUnit>();
const roleColumn = createColumnHelper<IRole>();
const skillColumn = createColumnHelper<ISkill>();
const salaryClaimColumn = createColumnHelper<ISalaryClaim>();
const availabilityColumn = createColumnHelper<IAvailability>();
const schoolingtColumn = createColumnHelper<ISchooling>();

const size = 5;

export default function Records() {
  const [table, setTable] = useState<Table<any>>();
  const [type, setType] = useState(0);
  const [tableData, setTableData] = useState<{
    data: any[];
    totalCount: number;
  }>();

  const [updateUnit] = useUpdateUnitMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [updateSkill] = useUpdateSkillMutation();
  const [updateSalaryClaim] = useUpdateSalaryClaimMutation();
  const [updateAvailability] = useUpdateAvailabilityMutation();
  const [updateSchooling] = useUpdateSchoolingMutation();

  const { setParams } = useTableParams();
  const { get } = useSearchParams();

  const [currentPage, setCurrentPage] = useState<number>(
    get("page") ? Number(get("page")) : 1,
  );

  const handleGetData = () => {
    switch (type) {
      case 0:
        return getAllUnits(currentPage, size);
      case 1:
        return getAllRoles(currentPage, size);
      case 2:
        return getAllSkills(currentPage, size);
      case 3:
        return getAllSalaryClaim(currentPage, size);
      case 4:
        return getAllAvailabilities(currentPage, size);
      case 5:
        return getAllSchoolings(currentPage, size);
      default:
        return null;
    }
  };

  const handleUpdateData = () => {
    switch (type) {
      case 0:
        return updateUnit;
      case 1:
        return updateRole;
      case 2:
        return updateSkill;
      case 3:
        return updateSalaryClaim;
      case 4:
        return updateAvailability;
      case 5:
        return updateSchooling;
    }
  };

  const dataPropertys = [
    "units",
    "roles",
    "skills",
    "salaryClaims",
    "availabilities",
    "schoolings",
  ];

  const handleSwitchChange = (checked: boolean, rowIndex: number) => {
    const newItem = {
      id: "",
      status: checked ? "ATIVO" : "INATIVO",
    };

    const newItems = tableData!.data.map((item, index) => {
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
      const update = handleUpdateData();
      update && update(newItem);

      setTableData({
        data: newItems,
        totalCount: tableData!.totalCount,
      });
    }, 100);
  };

  const items = [
    {
      name: "Unidade/Site",
      id: "Unidade/Site",
      buttonText: "Nova Unidade",
      columns: [
        unitColumn.accessor("status", {
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
        unitColumn.accessor("unitAcronym", {
          header: "Sigla",
          cell: row => <div>{row.getValue()}</div>,
        }),
        unitColumn.accessor("unitName", {
          header: "Nome",
          cell: row => <div>{row.getValue()}</div>,
        }),
        unitColumn.accessor("unitAddress", {
          header: "Endereço",
          cell: row => <div>{row.getValue()}</div>,
        }),
        {
          header: "Ações",
          cell: () => <Actions />,
        },
        unitColumn.accessor("updatedAt", {
          header: "Atualizado em",
          cell: row => (
            <div>{dayjs(row.getValue()).format("DD/MM/YYYY hh:mm:ss")}</div>
          ),
        }),
      ],
    },
    {
      name: "Cargos",
      id: "Cargos",
      buttonText: "Novo Cargo",
      columns: [
        roleColumn.accessor("status", {
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
        roleColumn.accessor("roleText", {
          header: "Nome",
          cell: row => <div>{row.getValue()}</div>,
        }),
        roleColumn.accessor("roleDescription", {
          header: "Descrição",
          cell: row => <div>{row.getValue()}</div>,
        }),
        {
          header: "Ações",
          cell: () => <Actions />,
        },
        roleColumn.accessor("updatedAt", {
          header: "Atualizado em",
          cell: row => (
            <div>{dayjs(row.getValue()).format("DD/MM/YYYY hh:mm:ss")}</div>
          ),
        }),
      ],
    },
    {
      name: "Habilidades",
      id: "Habilidades",
      buttonText: "Nova Habilidade",
      columns: [
        skillColumn.accessor("status", {
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
        skillColumn.accessor("skillText", {
          header: "Habilidade",
          cell: row => <div>{row.getValue()}</div>,
        }),
        {
          header: "Ações",
          cell: () => <Actions />,
        },
        skillColumn.accessor("updatedAt", {
          header: "Atualizado em",
          cell: row => (
            <div>{dayjs(row.getValue()).format("DD/MM/YYYY hh:mm:ss")}</div>
          ),
        }),
      ],
    },
    {
      name: "Pretensão salarial",
      id: "Pretensão salarial",
      buttonText: "Nova Pretensão Salarial",
      columns: [
        salaryClaimColumn.accessor("status", {
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
        salaryClaimColumn.accessor(row => `${row.fromAmount} ${row.toAmount}`, {
          header: "Pretensão salarial",
          id: "salaryClaim",
          cell: row => {
            const values = String(row.getValue()).split(" ");

            const firstValue = formatCurrency(Number(values[0]));
            const secondValue = formatCurrency(Number(values[1]));

            return (
              <div>
                De {firstValue} até {secondValue}
              </div>
            );
          },
        }),
        {
          header: "Ações",
          cell: () => <Actions />,
        },
        salaryClaimColumn.accessor("createdAt", {
          header: "Atualizado em",
          cell: row => (
            <div>{dayjs(row.getValue()).format("DD/MM/YYYY hh:mm:ss")}</div>
          ),
        }),
      ],
    },
    {
      name: "Disponibilidades",
      id: "Disponibilidades",
      buttonText: "Nova Disponibilidade",
      columns: [
        availabilityColumn.accessor("status", {
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
        availabilityColumn.accessor(
          row =>
            `${row.startDay} ${row.endDay} ${row.startHour} ${row.endHour}`,
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
          cell: () => <Actions />,
        },
        availabilityColumn.accessor("updatedAt", {
          header: "Atualizado em",
          cell: row => (
            <div>{dayjs(row.getValue()).format("DD/MM/YYYY hh:mm:ss")}</div>
          ),
        }),
      ],
    },
    {
      name: "Escolaridade",
      id: "Escolaridade",
      buttonText: "Nova Escolaridade",
      columns: [
        schoolingtColumn.accessor("status", {
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
        schoolingtColumn.accessor("schoolingName", {
          header: "Escolaridade",
          cell: row => <div>{row.getValue()}</div>,
        }),
        schoolingtColumn.accessor("informCourse", {
          header: "Escolaridade",
          cell: row => <div>{row.getValue() ? "Sim" : "Não"}</div>,
        }),
        {
          header: "Ações",
          cell: () => <Actions />,
        },
        schoolingtColumn.accessor("updatedAt", {
          header: "Atualizado em",
          cell: row => (
            <div>{dayjs(row.getValue()).format("DD/MM/YYYY hh:mm:ss")}</div>
          ),
        }),
      ],
    },
  ];

  const handleChangeSelect = (value: { name: string; id: string }) => {
    setParams("page", "1");
    setCurrentPage(1);

    items.map((item, index) => {
      if (item.id === value.id) setType(index);
    });
  };

  const handleTogglePage = async (page: number) => {
    setCurrentPage(page + 1);
  };

  useEffect(() => {
    handleGetData()?.then(data => {
      setTableData({
        data: data[dataPropertys[type]],
        totalCount: data.totalCount,
      });
    });
  }, [type]);

  useEffect(() => {
    setParams("page", String(currentPage));
    handleGetData()?.then(data => {
      setTableData({
        data: data[dataPropertys[type]],
        totalCount: data.totalCount,
      });
    });
  }, [currentPage]);

  useEffect(() => {
    handleGetData()?.then(data => {
      setTableData({
        data: data[dataPropertys[type]],
        totalCount: data.totalCount,
      });
    });
  }, []);

  if (!tableData) return;

  return (
    <div className={styles.records}>
      <Select
        placeholder={items[type].name}
        options={items}
        onChange={handleChangeSelect}
        defaultValue={items[type].id}
        width="296px"
      />
      <div className={styles.records__actions}>
        <Button
          text="Exportar dados"
          buttonType="secondary"
          icon={<SystemUpdate />}
        />
        <Button
          buttonType="primary"
          text={items[type].buttonText}
          icon={<AddCircle />}
        />
      </div>

      {tableData ? (
        <DataTable
          currentPage={currentPage}
          handleTogglePage={handleTogglePage}
          defaultTableSize={5}
          setTable={setTable}
          size={tableData.totalCount}
          data={tableData.data}
          columns={items[type].columns}
        />
      ) : (
        <div className={styles.loading}>
          <ReactLoading
            type="spin"
            color="#001866"
            height={"3%"}
            width={"3%"}
          />
        </div>
      )}
    </div>
  );
}

function Actions() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
      }}
    >
      <IconButton buttonType="delete" icon={<Delete />} />
      <IconButton buttonType="edit" icon={<EditSquare />} />
    </div>
  );
}

function IconButton({ icon, buttonType, ...props }: IconButtonProps) {
  return (
    <button
      className={`${styles.iconButton} ${
        buttonType === "delete"
          ? styles.iconButton__delete
          : styles.iconButton__edit
      }`}
      {...props}
    >
      {icon}
    </button>
  );
}
