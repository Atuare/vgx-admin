"use client";
import { CheckCircle } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { DataTable } from "@/components/Table";
import { Actions } from "@/components/Tables/components/Actions";
import {
  IInscriptions,
  ISubscription,
  TRequirements,
} from "@/interfaces/inscription.inteface";
import {
  useGetSubscriptionSettingsQuery,
  useUpdateSubscriptionSettingsMutation,
} from "@/services/api/fetchApi";
import { Toast } from "@/utils/toast";
import { Table, createColumnHelper } from "@tanstack/react-table";
import { SyntheticEvent, useEffect, useState } from "react";
import styles from "./InscriptionsConfig.module.scss";

const RequirementNames = {
  turnOffTime: "Tempo de desligamento (dias)",
  typeOfTurnOffTime: "Tipo de desligamento",
  timeBetweenProcesses: "Tempo entre processos (dias)",
  sellRate: "Meta de vendas (% mín.)",
  sellAbs: "Meta de abs (%)",
  misCalcTime: "Período de cálculo do MIS ",
};

const RequirementTypesOptions = [
  {
    name: "Passivo",
    id: "PASSIVO",
  },
  {
    name: "Ativo",
    id: "ATIVO",
  },
];

const RequirementTypes = {
  PASSIVO: "Passivo",
  ATIVO: "Ativo",
};

export default function ConfigInscriptions() {
  const [inscriptions, setInscriptions] = useState<IInscriptions>();
  const [typeOfTurnOffTime, setTypeOfTurnOffTime] = useState("");
  const [table, setTable] = useState<Table<any>>();

  const { data, isSuccess, refetch, isFetching } =
    useGetSubscriptionSettingsQuery({});
  const [updateRequirement] = useUpdateSubscriptionSettingsMutation({});

  const getSubscriptions = () => {
    let totalCount = 0;
    const subscriptions: ISubscription[] = [];
    Object.entries(data).map(item => {
      subscriptions.push({
        id: totalCount,
        requirement: item[0] as TRequirements,
        value: item[1] as string | number,
        editable: false,
      });
      totalCount++;
    });

    return {
      subscriptions,
      totalCount,
    };
  };

  const handleDeleteRequirement = (requirement: string) => {
    const newValue = requirement === "typeOfTurnOffTime" ? "PASSIVO" : 0;

    updateRequirement({
      ...data,
      [requirement]: newValue,
    }).then(response => {
      if ("error" in response) {
        Toast("error", "Não foi possível resetar o requisito");
        refetch();
      } else {
        Toast("success", "Requisito resetado com sucesso");
        refetch();
      }
    });
  };

  const handleEditRequirement = (
    event: SyntheticEvent,
    requirement: string,
  ) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      input: { value: string };
    };

    const value =
      requirement === "typeOfTurnOffTime"
        ? typeOfTurnOffTime
        : Number(target.input.value);

    updateRequirement({
      ...data,
      [requirement]: value,
    }).then(response => {
      if ("error" in response) {
        Toast("error", "Não foi possível atualizar o requisito");
        refetch();
      } else {
        Toast("success", "Requisito atualizado com sucesso");
        refetch();
      }
    });
  };

  const handleEditEditableRequirement = (id: number) => {
    const newInscriptions = inscriptions?.subscriptions.map(item => {
      if (item.id === id) {
        return {
          ...item,
          editable: !item.editable,
        };
      }

      return item;
    });

    if (newInscriptions) {
      setInscriptions({
        subscriptions: newInscriptions,
        totalCount: newInscriptions.length,
      });
    }
  };

  const columnHelper = createColumnHelper<ISubscription>();
  const columns = [
    columnHelper.accessor("requirement", {
      header: "Requisito",
      cell: row => (
        <div className={styles.table__requirement}>
          {RequirementNames[row.getValue() as keyof typeof RequirementNames]}
        </div>
      ),
    }),
    columnHelper.accessor(val => `${val.value}/${val.editable}`, {
      header: "Valor",
      cell: row => {
        const value = row.getValue().split("/")[0];
        const editable = row.getValue().split("/")[1] === "true" ? true : false;

        return (
          <div className={styles.table__value}>
            {editable ? (
              <form
                className={styles.table__form}
                onSubmit={e =>
                  handleEditRequirement(e, row.row.original.requirement)
                }
              >
                {/[+-]?([0-9]*[.])?[0-9]+/.test(value) ? (
                  <input
                    type="number"
                    defaultValue={Number(value)}
                    step="any"
                    className={styles.table__input}
                    name="input"
                  />
                ) : (
                  <Select
                    options={RequirementTypesOptions}
                    defaultValue={
                      RequirementTypes[value as keyof typeof RequirementTypes]
                    }
                    value={
                      RequirementTypes[
                        typeOfTurnOffTime as keyof typeof RequirementTypes
                      ]
                    }
                    placeholder="Selecione"
                    onChange={({ id }) =>
                      id !== value ? setTypeOfTurnOffTime(id) : null
                    }
                  />
                )}

                <span className={styles.table__form__submit}>
                  <Button text="" buttonType="primary" icon={<CheckCircle />} />
                </span>
              </form>
            ) : /[+-]?([0-9]*[.])?[0-9]+/.test(value) ? (
              value
            ) : (
              RequirementTypes[value as keyof typeof RequirementTypes]
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("id", {
      id: "actions",
      header: "Ações",
      cell: row => {
        return (
          <Actions
            handleDelete={() =>
              handleDeleteRequirement(row.row.original.requirement)
            }
            value={
              RequirementNames[
                row.row.original.requirement as keyof typeof RequirementNames
              ]
            }
            handleEdit={() => handleEditEditableRequirement(row.getValue())}
          />
        );
      },
    }),
  ];

  useEffect(() => {
    if (isSuccess) {
      setInscriptions(getSubscriptions());
    }
  }, [isSuccess, isFetching]);

  if (!inscriptions) return null;

  return (
    <main className={styles.inscriptions}>
      <h2>Pré requisitos para inscrição de candidatos</h2>
      <DataTable
        columns={columns}
        currentPage={1}
        data={inscriptions?.subscriptions}
        defaultTableSize={inscriptions?.totalCount}
        handleTogglePage={() => {}}
        setTable={setTable}
        size={inscriptions?.totalCount}
        loading={isFetching}
        disablePagination
      />
    </main>
  );
}
