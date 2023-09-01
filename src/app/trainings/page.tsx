"use client";

import { AddCircle, Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import { TrainingTable } from "@/components/TrainingTable";
import Link from "next/link";
import { useRef, useState } from "react";
import styles from "./training.module.scss";

export default function Trainings() {
  const [value, setValue] = useState<string>("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleInputValue(value: string) {
    setValue(value);
  }

  function handleExportData() {
    if (buttonRef.current) buttonRef.current.click();
  }

  return (
    <div className={styles.training}>
      <div className={styles.training__actions}>
        <Button
          text="Exportar dados"
          buttonType="secondary"
          icon={<SystemUpdate />}
          onClick={handleExportData}
        />

        <SearchInput handleChangeValue={handleInputValue} icon={<Search />} />
        <Link href="/training/create">
          <Button
            text="Novo Treinamento"
            buttonType="primary"
            icon={<AddCircle />}
          />
        </Link>
      </div>
      <TrainingTable />
    </div>
  );
}
