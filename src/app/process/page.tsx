"use client";
import { useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";

import styles from "./Process.module.scss";

import { AddCircle, Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { ProcessTable } from "@/components/ProcessTable";
import { SearchInput } from "@/components/SearchInput";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Process() {
  const [value, setValue] = useState<string>("");
  const tableRef = useRef(null);

  const { get } = useSearchParams();
  const page = get("page") ? Number(get("page")) : 1;

  function handleInputValue(value: string) {
    setValue(value);
  }

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `Processos pag. ${page}`,
    sheet: `Processos pag. ${page}`,
  });

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
      <ProcessTable tableRef={tableRef} globalFilter={value} />
    </div>
  );
}
