"use client";
import { Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import styles from "./Admissions.module.scss";

export default function Admmissions() {
  const handleInputValue = (value: string) => {};

  return (
    <div className={styles.admissions}>
      <div className={styles.admissions__actions}>
        <Button
          text="Exportar dados"
          buttonType="secondary"
          icon={<SystemUpdate />}
        />

        <SearchInput handleChangeValue={handleInputValue} icon={<Search />} />
      </div>
    </div>
  );
}
