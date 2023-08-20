"use client";
import { useEffect, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";

import styles from "./Process.module.scss";

import { AddCircle, Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import { DataTable } from "@/components/Table";
import { useProcessTable } from "@/hooks/useProcessTable";
import { useProcesses } from "@/hooks/useProcesses";
import { useTableParams } from "@/hooks/useTableParams";
import Link from "next/link";

export default function Process() {
  const [value, setValue] = useState<string>("");
  const tableRef = useRef(null);

  const { processes } = useProcesses();
  const { currentPage } = useProcessTable();
  const { setParams } = useTableParams();

  function handleInputValue(value: string) {
    setValue(value);
  }

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `Processos pag. ${currentPage}`,
    sheet: `Processos pag. ${currentPage}`,
  });

  useEffect(() => {
    setParams("page", String(currentPage));
  }, [currentPage]);

  return (
    <div className={styles.process}>
      <div className={styles.process__actions}>
        <Button
          text="Exportar dados"
          buttonType="secondary"
          icon={<SystemUpdate />}
          onClick={onDownload}
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
          size={processes.totalCount}
          tableName="processes"
          ref={tableRef}
        />
      </section>
    </div>
  );
}
