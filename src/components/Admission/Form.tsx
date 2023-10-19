"use client";
import { Search } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { DataInput } from "@/components/DataInput";
import { Input } from "@/components/Input";
import { NumberInput } from "@/components/NumberInput";
import { SearchInput } from "@/components/SearchInput";
import { Select } from "@/components/Select";
import { CreateAdmissionTable } from "@/components/Tables/CreateAdmissionTable";
import { IAdmissionResult } from "@/interfaces/admissions.interface";
import { createAdmissionsSchema } from "@/schemas/admissionSchema";
import { useGetAllUnitsQuery } from "@/services/api/fetchApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { Table } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "../../app/admissions/create/AdmissionCreate.module.scss";
dayjs.extend(utc);

interface AdmissionFormProps {
  defaultTableSize: number;
  defaultValue?: IAdmissionResult;
  handleOnSubmit: (data: any) => void;
}

export default function AdmissionForm({
  defaultTableSize,
  defaultValue,
  handleOnSubmit,
}: AdmissionFormProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [table, setTable] = useState<Table<any>>();

  const defaultCandidacysIds = defaultValue?.admissionResult.map(
    item => item.candidacy.id,
  );

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(createAdmissionsSchema),
  });

  const [unitOptions, setUnitsOptions] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const { data: units, isSuccess: unitsSuccess } = useGetAllUnitsQuery({
    page: 1,
    size: 9999,
  });

  const handleGetSelectedRowsId = () => {
    const selectedRows = table
      ?.getSelectedRowModel()
      .flatRows.map(row => row.original);

    if (selectedRows && selectedRows.length > 0) {
      return selectedRows.map(row => row.id);
    }

    return [];
  };

  useEffect(() => {
    if (unitsSuccess) {
      setUnitsOptions(
        units.units.map(unit => {
          return { id: unit.id, name: unit.unitName };
        }),
      );
    }
  }, [unitsSuccess]);

  useEffect(() => {
    if (defaultValue) {
      reset({
        unit: defaultValue?.admission?.unit?.id,
        date: defaultValue?.admission?.date,
        limitCandidates: defaultValue?.admission?.limitCandidates,
        product: defaultValue?.admission?.product,
        candidacysIds: defaultCandidacysIds,
      });
    }
  }, [defaultValue]);

  return (
    <form
      className={styles.admissionCreate}
      onSubmit={handleSubmit(handleOnSubmit)}
    >
      <section className={styles.admissionCreate__classInfo}>
        <h1>Dados turma</h1>
        <div className={styles.admissionCreate__classInfo__inputs}>
          <Controller
            control={control}
            name="unit"
            render={({ fieldState: { error }, field: { onChange } }) => (
              <DataInput name="Unidade/Site" required error={error?.message}>
                <Select
                  placeholder="Selecione"
                  options={unitOptions}
                  onChange={val => onChange(val.id)}
                  defaultValue={defaultValue?.admission?.unit?.unitName}
                />
              </DataInput>
            )}
          />

          <Controller
            control={control}
            name="product"
            render={({ fieldState: { error }, field: { onChange } }) => (
              <DataInput required name="Produto" error={error?.message}>
                <Input
                  onChange={e => onChange(e.target.value)}
                  defaultValue={defaultValue?.admission?.product}
                />
              </DataInput>
            )}
          />

          <Controller
            control={control}
            name="date"
            render={({ fieldState: { error }, field: { onChange } }) => (
              <DataInput required name="Data admissão" error={error?.message}>
                <input
                  type="date"
                  onChange={e => onChange(e.target.value)}
                  defaultValue={
                    defaultValue?.admission?.date
                      ? dayjs(defaultValue?.admission?.date)
                          .utc()
                          .format("YYYY-MM-DD")
                      : undefined
                  }
                />
              </DataInput>
            )}
          />

          <Controller
            control={control}
            name="limitCandidates"
            render={({ fieldState: { error }, field: { onChange } }) => (
              <DataInput
                name="Lim. participantes"
                required
                error={error?.message}
              >
                <NumberInput
                  onChange={val => onChange(val)}
                  defaultValue={defaultValue?.admission?.limitCandidates}
                />
              </DataInput>
            )}
          />
        </div>
      </section>

      <section className={styles.admissionCreate__table}>
        <h1>Selecionar candidatos</h1>
        <div className={styles.admissionCreate__table__input}>
          <SearchInput handleChangeValue={setGlobalFilter} icon={<Search />} />
        </div>

        <Controller
          control={control}
          name="candidacysIds"
          render={({ fieldState: { error }, field: { onChange } }) => (
            <>
              <CreateAdmissionTable
                defaultTableSize={defaultTableSize}
                setTable={setTable}
                table={table}
                globalFilter={globalFilter}
                handleOnChangeRowSelection={() => {
                  const ids = handleGetSelectedRowsId();
                  !defaultValue && onChange(ids);
                }}
              />
              <p className={styles.error}>{error?.message}</p>
            </>
          )}
        />
      </section>

      <footer className={styles.admissionCreate__footer}>
        <Button buttonType="default" text="Cancelar" type="button" />
        <Button buttonType="primary" text="Salvar" type="submit" />
      </footer>
    </form>
  );
}
