"use client";
import { Search } from "@/assets/Icons";
import { DataInput } from "@/components/DataInput";
import { Input } from "@/components/Input";
import { NumberInput } from "@/components/NumberInput";
import { SearchInput } from "@/components/SearchInput";
import { Select } from "@/components/Select";
import { useGetAllUnitsQuery } from "@/services/api/fetchApi";
import { useEffect, useState } from "react";
import styles from "./AdmissionCreate.module.scss";

export default function AdmissionCreate() {
  const [unitOptions, setUnitsOptions] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const { data: units, isSuccess: unitsSuccess } = useGetAllUnitsQuery({
    page: 1,
    size: 9999,
  });

  const handleChangeInputValue = (value: string) => {};

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
          <DataInput required name="Examinador">
            <Input />
          </DataInput>

          <DataInput name="Unidade/Site" required>
            <Select
              placeholder="Selecione"
              options={unitOptions}
              onChange={() => {}}
            />
          </DataInput>

          <DataInput required name="Data inicial">
            <input type="date" />
          </DataInput>

          <DataInput required name="Data final">
            <input type="date" />
          </DataInput>

          <DataInput name="Lim. participantes" required>
            <NumberInput onChange={() => {}} />
          </DataInput>

          <DataInput required name="Horário">
            <input type="time" />
          </DataInput>
        </div>
      </section>

      <section className={styles.admissionCreate__table}>
        <h1>Selecionar candidatos</h1>
        <div className={styles.admissionCreate__table__input}>
          <SearchInput
            handleChangeValue={handleChangeInputValue}
            icon={<Search />}
          />
        </div>
      </section>
    </div>
  );
}
