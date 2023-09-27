"use client";

import { DataInput } from "@/components/DataInput";
import { Select } from "@/components/Select";
import { useGetAllUnitsQuery } from "@/services/api/fetchApi";
import { ReactNode } from "react";
import styles from "./TestCreate.module.scss";

export default function TestCreate() {
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
