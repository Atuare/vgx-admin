import { useEffect, useState } from "react";
import styles from "./Pagination.module.scss";
import { Table } from "@tanstack/react-table";
import { useProcesses } from "@/hooks/useProcesses";
import { fetchApi } from "@/services/api/fetchApi";
import { useDispatch } from "react-redux";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalCount: number;
}
export function DataTablePagination<TData>({
  table,
  totalCount,
}: DataTablePaginationProps<TData>) {
  const [pages, setPages] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { setProcesses, defaultTableSize } = useProcesses();
  const dispatch = useDispatch();

  async function getAllProcess(page: number, defaultTableSize: number) {
    const { data: processesData } = await dispatch<any>(
      fetchApi.endpoints.getAllProcess.initiate({
        page: page,
        size: defaultTableSize,
      }),
    );

    return processesData;
  }

  async function handlePaginationChange(to: "previous" | "next") {
    let page = currentPage;

    if (to === "previous" && page > 1) {
      page -= 1;
    } else if (
      to === "next" &&
      page < Math.round(totalCount / defaultTableSize)
    ) {
      page += 1;
    }

    const data = await getAllProcess(page, defaultTableSize);
    if (to === "previous") {
      table.previousPage();
    } else {
      table.nextPage();
    }

    setProcesses(data);
    setCurrentPage(page);
  }

  useEffect(() => {
    const pagesArray: number[] = [];

    for (let i = 1; i <= Math.round(totalCount / defaultTableSize); i++) {
      pagesArray.push(i);
    }

    setPages(pagesArray);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__info}>
        {currentPage} a {Math.round(totalCount / defaultTableSize)} do total de{" "}
        {totalCount} registros
      </div>
      <div className={styles.footer__actions}>
        <button
          onClick={() => {
            handlePaginationChange("previous");
          }}
        >
          &lt; Anterior
        </button>
        <div className={styles.footer__pages}>
          {pages.map(item => (
            <button
              key={crypto.randomUUID()}
              data-state={currentPage === item ? "active" : "inactive"}
              onClick={async () => {
                const data = await getAllProcess(item, defaultTableSize);
                table.setPageIndex(item - 1);
                setProcesses(data);
                setCurrentPage(item);
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            handlePaginationChange("next");
          }}
        >
          Próximo &gt;
        </button>
      </div>
      <div className={styles.disabled} />
    </footer>
  );
}
