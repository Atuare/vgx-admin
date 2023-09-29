import {
  NextButton,
  PageButton,
  Pagination,
  PrevButton,
} from "react-headless-pagination";

import { Table } from "@tanstack/react-table";
import styles from "./Pagination.module.scss";

interface DataTablePaginationProps {
  size: number;
  currentPage: number;
  totalPages: number;
  handleTogglePage: (page: number) => void;
  table: Table<any>;
}

export function DataTablePagination({
  currentPage,
  size,
  totalPages,
  handleTogglePage,
}: DataTablePaginationProps) {
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
          setCurrentPage={handleTogglePage}
          totalPages={totalPages}
          truncableClassName=""
          truncableText="..."
        >
          <PrevButton type="button">&lt; Anterior</PrevButton>
          <div className={styles.footer__pages}>
            <PageButton
              activeClassName={styles.footer__pages__item__active}
              className={styles.footer__pages__item}
              type="button"
            />
          </div>
          <NextButton type="button">Próximo &gt;</NextButton>
        </Pagination>
      </div>
      <div className={styles.disabled} />
    </footer>
  );
}
