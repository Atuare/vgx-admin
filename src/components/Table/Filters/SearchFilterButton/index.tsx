import { Close, FilterAlt, Search } from "@/assets/Icons";
import { useTableParams } from "@/hooks/useTableParams";
import * as Popover from "@radix-ui/react-popover";
import { Table } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "../../../Button";
import { SearchInput } from "../../../SearchInput";
import styles from "../FilterButton/FilterButton.module.scss";

interface SearchFilterButtonProps {
  title: string;
  table: Table<any> | undefined;
  column: string;
}

export function SearchFilterButton({
  title,
  table,
  column,
}: SearchFilterButtonProps) {
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = (value: boolean) => setOpenFilter(value);

  const { get } = useSearchParams();

  const getFilterValues = () => {
    const paramsValue = get(column);
    paramsValue && table?.getColumn(column)?.setFilterValue(paramsValue);
  };

  useEffect(() => {
    getFilterValues();
  }, []);

  return (
    <div
      className={styles.container}
      data-state={openFilter ? "active" : "inactive"}
    >
      <PopoverFilter
        handleOpenFilter={handleOpenFilter}
        table={table}
        column={column}
        openFilter={openFilter}
      >
        <button
          className={styles.button}
          onClick={() => setOpenFilter(prev => !prev)}
        >
          <div className={styles.iconContainer}>
            <FilterAlt />
          </div>
          {title}
        </button>
      </PopoverFilter>
    </div>
  );
}

export function PopoverFilter({
  children,
  handleOpenFilter,
  table,
  column,
  openFilter,
}: {
  children: ReactNode;
  handleOpenFilter: (value: boolean) => void;
  table: Table<any> | undefined;
  column: string;
  openFilter: boolean;
}) {
  const [inputValue, setInputValue] = useState<string>("");

  const { get } = useSearchParams();
  const { setParams } = useTableParams();

  const handleToggleFilter = () => {
    table?.getColumn(column)?.setFilterValue(inputValue);
    setParams(column, inputValue);
  };

  const getFilterValues = () => {
    const paramsValue = get(column);
    paramsValue && setInputValue(paramsValue);
  };

  return (
    <Popover.Root
      open={openFilter}
      onOpenChange={open => {
        handleOpenFilter(open);
        if (open) {
          getFilterValues();
        } else {
          setInputValue("");
        }
      }}
    >
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <form className={styles.popover} onSubmit={e => e.preventDefault()}>
          <Popover.Content className={styles.popover__content} sideOffset={5}>
            <header>
              <SearchInput
                handleChangeValue={setInputValue}
                icon={<Search />}
                defaultValue={inputValue}
              />
              <Popover.Close
                className={styles.popover__close}
                aria-label="Close"
                type="button"
              >
                <Close />
              </Popover.Close>
            </header>

            <div className={styles.popover__content__buttons}>
              <Popover.Close asChild>
                <Button buttonType="default" text="Cancelar" type="button" />
              </Popover.Close>
              <Button
                buttonType="primary"
                text="OK"
                onClick={handleToggleFilter}
              />
            </div>
          </Popover.Content>
        </form>
      </Popover.Portal>
    </Popover.Root>
  );
}
