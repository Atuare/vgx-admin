import {
  NextButton,
  PageButton,
  Pagination,
  PrevButton,
} from "react-headless-pagination";

import { useProcessTable } from "@/hooks/useProcessTable";
import { useProcesses } from "@/hooks/useProcesses";
import { getAllProcess } from "@/utils/process";
import styles from "./Pagination.module.scss";

interface DataTablePaginationProps {
  size: number;
  handlePageChange?: (page: number) => void;
  currentPage?: number;
  setCurrentPage?: (currentPage: number) => void;
  totalPages?: number;
}

export function DataTablePagination({
  size,
  handlePageChange,
}: DataTablePaginationProps) {
  const { setProcesses } = useProcesses();
  const { currentPage, defaultTableSize, setCurrentPage } = useProcessTable();
  const totalPages = Math.ceil(size / defaultTableSize);

  async function handlePaginationChange(page: number) {
    const data = await getAllProcess(page + 1, defaultTableSize);

    setProcesses(data);
    setCurrentPage(page + 1);
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__info}>
        {currentPage} a {totalPages} do total de {size} registros
      </div>
      <div className={styles.footer__actions}>
        <Pagination
          className={styles.footer__actions}
          currentPage={currentPage - 1}
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
