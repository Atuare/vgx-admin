"use client";
import { Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import { useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import styles from "./Interviews.module.scss";

export default function Interviews() {
  const tableRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `Processos pag. ${currentPage}`,
    sheet: `Processos pag. ${currentPage}`,
  });

  const handleInputValue = (value: string) => {};

  return (
    <div className={styles.interviews}>
      <div className={styles.interviews__actions}>
        <Button
          text="Exportar dados"
          buttonType="secondary"
          icon={<SystemUpdate />}
          onClick={onDownload}
        />

        <SearchInput handleChangeValue={handleInputValue} icon={<Search />} />
      </div>
    </div>
  );
}