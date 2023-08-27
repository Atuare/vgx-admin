"use client";
import { useRef, useState } from "react";

import styles from "./Process.module.scss";

import { AddCircle, Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { ProcessTable } from "@/components/ProcessTable";
import { SearchInput } from "@/components/SearchInput";
import Link from "next/link";

export default function Process() {
  const [value, setValue] = useState<string>("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleInputValue(value: string) {
    setValue(value);
  }

  function handleExportData() {
    if (buttonRef.current) buttonRef.current.click();
  }

  return (
    <div className={styles.process}>
      <div className={styles.process__actions}>
        <Button
          text="Exportar dados"
          buttonType="secondary"
          icon={<SystemUpdate />}
          onClick={handleExportData}
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
      <ProcessTable globalFilter={value} ref={buttonRef} />
    </div>
  );
}
