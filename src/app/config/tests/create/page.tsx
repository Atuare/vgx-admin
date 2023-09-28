"use client";

import { Publish, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { DataInput } from "@/components/DataInput";
import { TestCreateModal } from "@/components/Modals/TestCreateModal";
import { Select } from "@/components/Select";
import { TestsCreateTable } from "@/components/Tables/TestsCreateTable";
import { TipTap } from "@/components/TipTap";
import { testsCreateConfigSchema } from "@/schemas/configTestsSchema";
import { useGetAllUnitsQuery } from "@/services/api/fetchApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { Table } from "@tanstack/react-table";
import { ReactNode, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./TestCreate.module.scss";

export default function TestCreate() {
  const [table, setTable] = useState<Table<any>>();

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(testsCreateConfigSchema),
  });

  const { data: units } = useGetAllUnitsQuery({
    page: 1,
    size: 1000,
    orderBy: "unitName",
    direction: "ASC",
  });

  const handleCreateTest = (data: any) => {
    // console.log(data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleCreateTest)}>
      <h3 className={styles.form__title}>Dados prova</h3>
      <Container>
        <Controller
          control={control}
          name="unitId"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <DataInput
              name="Unidade/Site"
              required
              width="296px"
              error={error?.message}
            >
              <Select
                onChange={({ id }) => onChange(id)}
                options={
                  units
                    ? units.units.map(value => {
                        return { id: value.id, name: value.unitName };
                      })
                    : []
                }
                placeholder="Selecione"
              />
            </DataInput>
          )}
        />
        <Controller
          control={control}
          name="maxTime"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <DataInput
              name="Tempo máx. prova"
              lightName="(minutos)"
              required
              error={error?.message}
            >
              <input
                type="text"
                pattern="\d*"
                onChange={e => {
                  if (!e.target.validity.valid) {
                    e.target.value = "";
                    return;
                  }
                  onChange(e.target.value);
                }}
                style={{ width: 128 }}
              />
            </DataInput>
          )}
        />
      </Container>

      <Container>
        <Controller
          control={control}
          name="portTotal"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <DataInput
              name="Total de questões português"
              required
              error={error?.message}
            >
              <input
                type="text"
                pattern="\d*"
                onChange={e => {
                  if (!e.target.validity.valid) {
                    e.target.value = "";
                    return;
                  }
                  onChange(e.target.value);
                }}
                style={{ width: 128 }}
              />
            </DataInput>
          )}
        />

        <Controller
          control={control}
          name="portMinScore"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <DataInput
              name="Nota mín. aprovação"
              required
              error={error?.message}
            >
              <input
                type="text"
                pattern="\d*"
                onChange={e => {
                  if (!e.target.validity.valid) {
                    e.target.value = "";
                    return;
                  }
                  onChange(e.target.value);
                }}
                style={{ width: 128 }}
              />
            </DataInput>
          )}
        />

        <Controller
          control={control}
          name="matTotal"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <DataInput
              name="Total de questões matemática"
              required
              error={error?.message}
            >
              <input
                type="text"
                pattern="\d*"
                onChange={e => {
                  if (!e.target.validity.valid) {
                    e.target.value = "";
                    return;
                  }
                  onChange(e.target.value);
                }}
                style={{ width: 128 }}
              />
            </DataInput>
          )}
        />

        <Controller
          control={control}
          name="matMinScore"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <DataInput
              name="Nota mín. aprovação"
              required
              error={error?.message}
            >
              <input
                type="text"
                pattern="\d*"
                onChange={e => {
                  if (!e.target.validity.valid) {
                    e.target.value = "";
                    return;
                  }
                  onChange(e.target.value);
                }}
                style={{ width: 128 }}
              />
            </DataInput>
          )}
        />
      </Container>

      <Container>
        <Controller
          control={control}
          name="compTotal"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <DataInput
              name="Total de questões noções informática"
              required
              error={error?.message}
            >
              <input
                type="text"
                pattern="\d*"
                onChange={e => {
                  if (!e.target.validity.valid) {
                    e.target.value = "";
                    return;
                  }
                  onChange(e.target.value);
                }}
                style={{ width: 128 }}
              />
            </DataInput>
          )}
        />

        <Controller
          control={control}
          name="compMinScore"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <DataInput
              name="Nota mín. aprovação"
              required
              error={error?.message}
            >
              <input
                type="text"
                pattern="\d*"
                onChange={e => {
                  if (!e.target.validity.valid) {
                    e.target.value = "";
                    return;
                  }
                  onChange(e.target.value);
                }}
                style={{ width: 128 }}
              />
            </DataInput>
          )}
        />
      </Container>

      <h3 className={styles.form__title}>Questões prova</h3>

      <div className={styles.form__actions}>
        <Button
          buttonType="secondary"
          text="Exportar dados"
          icon={<SystemUpdate />}
          type="button"
        />

        <div className={styles.form__actions__right}>
          <Button
            buttonType="warning"
            text="Importar dados"
            icon={<Publish />}
            type="button"
          />

          <TestCreateModal handleOnSubmit={() => {}} create />
        </div>
      </div>

      <TestsCreateTable setTable={setTable} />

      <h3 className={styles.form__title}>Orientação para a prova</h3>
      <Controller
        control={control}
        name="orientationMessage"
        render={({ field: { onChange }, fieldState: { error } }) => (
          <div>
            <TipTap
              getContentFromEditor={content => {
                if (content.content[0].content) {
                  onChange(JSON.stringify(content));
                }
              }}
            />
            <p className={styles.error}>{error?.message}</p>
          </div>
        )}
      />

      <h3 className={styles.form__title}>Mensagem final</h3>
      <h4 className={styles.form__subtitle}>Aprovação*</h4>
      <Controller
        control={control}
        name="aproveMessage"
        render={({ field: { onChange }, fieldState: { error } }) => (
          <div>
            <TipTap
              getContentFromEditor={content => {
                if (content.content[0].content) {
                  onChange(JSON.stringify(content));
                }
              }}
            />
            <p className={styles.error}>{error?.message}</p>
          </div>
        )}
      />

      <h4 className={styles.form__subtitle}>Reprovação*</h4>
      <Controller
        control={control}
        name="disapprovedMessage"
        render={({ field: { onChange }, fieldState: { error } }) => (
          <div>
            <TipTap
              getContentFromEditor={content => {
                if (content.content[0].content) {
                  onChange(JSON.stringify(content));
                }
              }}
            />
            <p className={styles.error}>{error?.message}</p>
          </div>
        )}
      />

      <div className={styles.form__buttons}>
        <Button buttonType="default" text="Cancelar" />
        <Button buttonType="primary" text="Salvar" />
      </div>
    </form>
  );
}

function Container({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 48, alignItems: "center" }}>
      {children}
    </div>
  );
}
