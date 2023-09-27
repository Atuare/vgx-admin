"use client";

import { Publish, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { DataInput } from "@/components/DataInput";
import { TestCreateModal } from "@/components/Modals/TestCreateModal";
import { Select } from "@/components/Select";
import { TestsCreateTable } from "@/components/Tables/TestsCreateTable";
import { TipTap } from "@/components/TipTap";
import { useGetAllUnitsQuery } from "@/services/api/fetchApi";
import { Table } from "@tanstack/react-table";
import { ReactNode, useState } from "react";
import styles from "./TestCreate.module.scss";

export default function TestCreate() {
  const [table, setTable] = useState<Table<any>>();

  const { data: units } = useGetAllUnitsQuery({
    page: 1,
    size: 1000,
    orderBy: "unitName",
    direction: "ASC",
  });

  return (
    <form className={styles.form}>
      <h3 className={styles.form__title}>Dados prova</h3>
      <Container>
        <DataInput name="Unidade/Site" required width="296px">
          <Select
            onChange={() => {}}
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

        <DataInput name="Tempo máx. prova" lightName="(minutos)" required>
          <input
            type="text"
            pattern="\d*"
            onChange={e => {
              if (!e.target.validity.valid) {
                e.target.value = "";
                return;
              }
            }}
            style={{ width: 128 }}
          />
        </DataInput>
      </Container>

      <Container>
        <DataInput name="Total de questões português" required>
          <input
            type="text"
            pattern="\d*"
            onChange={e => {
              if (!e.target.validity.valid) {
                e.target.value = "";
                return;
              }
            }}
            style={{ width: 128 }}
          />
        </DataInput>

        <DataInput name="Nota mín. aprovação" required>
          <input
            type="text"
            pattern="\d*"
            onChange={e => {
              if (!e.target.validity.valid) {
                e.target.value = "";
                return;
              }
            }}
            style={{ width: 128 }}
          />
        </DataInput>

        <DataInput name="Total de questões matemática" required>
          <input
            type="text"
            pattern="\d*"
            onChange={e => {
              if (!e.target.validity.valid) {
                e.target.value = "";
                return;
              }
            }}
            style={{ width: 128 }}
          />
        </DataInput>

        <DataInput name="Nota mín. aprovação" required>
          <input
            type="text"
            pattern="\d*"
            onChange={e => {
              if (!e.target.validity.valid) {
                e.target.value = "";
                return;
              }
            }}
            style={{ width: 128 }}
          />
        </DataInput>
      </Container>

      <Container>
        <DataInput name="Total de questões noções informática" required>
          <input
            type="text"
            pattern="\d*"
            onChange={e => {
              if (!e.target.validity.valid) {
                e.target.value = "";
                return;
              }
            }}
            style={{ width: 128 }}
          />
        </DataInput>

        <DataInput name="Nota mín. aprovação" required>
          <input
            type="text"
            pattern="\d*"
            onChange={e => {
              if (!e.target.validity.valid) {
                e.target.value = "";
                return;
              }
            }}
            style={{ width: 128 }}
          />
        </DataInput>
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
      <TipTap getContentFromEditor={() => {}} />

      <h3 className={styles.form__title}>Mensagem final</h3>
      <h4 className={styles.form__subtitle}>Aprovação*</h4>
      <TipTap getContentFromEditor={() => {}} />

      <h4 className={styles.form__subtitle}>Reprovação*</h4>
      <TipTap getContentFromEditor={() => {}} />

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
