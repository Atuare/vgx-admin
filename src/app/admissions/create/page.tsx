"use client";
import { Search } from "@/assets/Icons";
import { DataInput } from "@/components/DataInput";
import { Input } from "@/components/Input";
import { NumberInput } from "@/components/NumberInput";
import { SearchInput } from "@/components/SearchInput";
import { Select } from "@/components/Select";
import { CreateAdmissionTable } from "@/components/Tables/CreateAdmissionTable";
import { useGetAllUnitsQuery } from "@/services/api/fetchApi";
import { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import styles from "./AdmissionCreate.module.scss";

const defaultTableSize = 5;

export default function AdmissionCreate() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [table, setTable] = useState<Table<any>>();

  const [unitOptions, setUnitsOptions] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const { data: units, isSuccess: unitsSuccess } = useGetAllUnitsQuery({
    page: 1,
    size: 9999,
  });

  useEffect(() => {
    if (unitsSuccess) {
      setUnitsOptions(
        units.units.map(unit => {
          return { id: unit.unitName, name: unit.unitName };
        }),
      );
    }
  }, [unitsSuccess]);

  return (
    <div className={styles.admissionCreate}>
      <section className={styles.admissionCreate__classInfo}>
        <h1>Dados turma</h1>
        <div className={styles.admissionCreate__classInfo__inputs}>
          <DataInput name="Unidade/Site" required>
            <Select
              placeholder="Selecione"
              options={unitOptions}
              onChange={() => {}}
            />
          </DataInput>
          <DataInput required name="Produto">
            <Input />
          </DataInput>

          <DataInput required name="Data admissão">
            <input type="date" />
          </DataInput>

          <DataInput name="Lim. participantes" required>
            <NumberInput onChange={() => {}} />
          </DataInput>
        </div>
      </section>

      <section className={styles.admissionCreate__table}>
        <h1>Selecionar candidatos</h1>
        <div className={styles.admissionCreate__table__input}>
          <SearchInput handleChangeValue={setGlobalFilter} icon={<Search />} />
        </div>
        <CreateAdmissionTable
          defaultTableSize={defaultTableSize}
          setTable={setTable}
          table={table}
          globalFilter={globalFilter}
        />
      </section>
    </div>
  );
}
