import { useState } from "react";
import {
  NextButton,
  PageButton,
  Pagination,
  PrevButton,
} from "react-headless-pagination";

import { useProcesses } from "@/hooks/useProcesses";

import { getAllProcess } from "@/utils/process";
import styles from "./Pagination.module.scss";

interface DataTablePaginationProps {
  totalCount: number;
}

export function DataTablePagination({ totalCount }: DataTablePaginationProps) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const { setProcesses, defaultTableSize } = useProcesses();
  const totalPages = Math.round(totalCount / defaultTableSize);

  async function handlePaginationChange(page: number) {
    const data = await getAllProcess(page + 1, defaultTableSize);

    setProcesses(data);
    setCurrentPage(page);
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__info}>
        {currentPage + 1} a {totalPages} do total de {totalCount} registros
      </div>
      <div className={styles.footer__actions}>
        <Pagination
          className={styles.footer__actions}
          currentPage={currentPage}
          edgePageCount={0}
          middlePagesSiblingCount={2}
          setCurrentPage={page => handlePaginationChange(page)}
          totalPages={totalPages}
          truncableClassName=""
          truncableText="..."
        >
          <PrevButton className="">&lt; Anterior</PrevButton>
          <div className={styles.footer__pages}>
            <PageButton
              activeClassName={styles.footer__pages__item__active}
              className={styles.footer__pages__item}
            />
          </div>
          <NextButton className="">Próximo &gt;</NextButton>
        </Pagination>
      </div>
      <div className={styles.disabled} />
    </footer>
  );
}
