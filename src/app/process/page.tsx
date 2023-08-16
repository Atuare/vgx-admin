"use client";
import { useEffect, useState } from "react";
import styles from "./Process.module.scss";

import { AddCircle, Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import { DataTable } from "@/components/Table";
import Link from "next/link";
import { useProcesses } from "@/hooks/useProcesses";

export default function Process() {
  const { processes } = useProcesses();
  const [value, setValue] = useState<string>("");

  function handleInputValue(value: string) {
    setValue(value);
  }

  function handleClickCell(row: number) {
    // console.log(row);
  }

  return (
    <div className={styles.process}>
      <div className={styles.process__actions}>
        <Button
          text="Exportar dados"
          buttonType="secondary"
          icon={<SystemUpdate />}
        />
        <SearchInput handleChangeValue={handleInputValue} icon={<Search />} />
        <Link href="/process/create">
          <Button
            text="Novo Processo"
            buttonType="primary"
            icon={<AddCircle />}
          />
        </Link>
      </div>

      <section className={styles.process__list}>
        <DataTable
          data={processes.processes}
          totalCount={processes.totalCount}
          handleClickCell={handleClickCell}
        />
      </section>
    </div>
  );
}
