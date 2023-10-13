import { Close, FilterAlt } from "@/assets/Icons";
import { useTableParams } from "@/hooks/useTableParams";
import * as Popover from "@radix-ui/react-popover";
import { Table } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "../../../Button";
import styles from "../DateFilterButton/DateFilterButton.module.scss";

interface DateTimeFilterButtonProps {
  title: string;
  table: Table<any> | undefined;
  column: string;
}

export function DateTimeFilterButton({
  title,
  table,
  column,
}: DateTimeFilterButtonProps) {
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = (value: boolean) => setOpenFilter(value);

  const { get } = useSearchParams();

  const getFilterValues = () => {
    const paramsValue = get(column);
    paramsValue &&
      table?.getColumn(column)?.setFilterValue(paramsValue.split(","));
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
  const [date, setDate] = useState<string>("");
  const [hour, setHour] = useState<string>("");

  const { get } = useSearchParams();
  const { setParams } = useTableParams();

  const handleToggleFilter = () => {
    if (!date && !hour) {
      table?.getColumn(column)?.setFilterValue([]);
      setParams(column, "");
      handleOpenFilter(false);
    } else {
      table?.getColumn(column)?.setFilterValue([date, hour]);
      setParams(column, [date, hour].join(","));
      handleOpenFilter(false);
    }
  };

  const getFilterValues = () => {
    const paramsValue = get(column);
    if (paramsValue) {
      const paramsArray = paramsValue.split(",");
      setDate(paramsArray[0]);
      setHour(paramsArray[1]);
    }
  };

  return (
    <Popover.Root
      open={openFilter}
      onOpenChange={open => {
        handleOpenFilter(open);
        if (open) {
          getFilterValues();
        }
      }}
    >
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <form
          className={styles.popover}
          onSubmit={e => {
            e.preventDefault();
            handleToggleFilter();
          }}
        >
          <Popover.Content className={styles.popover__content} sideOffset={5}>
            <header>
              <Popover.Close
                className={styles.popover__close}
                aria-label="Close"
                type="button"
              >
                <Close />
              </Popover.Close>
            </header>

            <div className={styles.popover__content__list}>
              <div>
                Data
                <input
                  type="date"
                  onChange={e => setDate(e.target.value)}
                  value={date}
                />
              </div>

              <div>
                Hora
                <input
                  type="time"
                  onChange={e => setHour(e.target.value)}
                  value={hour}
                />
                <button
                  style={{ alignSelf: "flex-end" }}
                  type="button"
                  onClick={() => setHour("")}
                >
                  Limpar hora
                </button>
              </div>
            </div>

            <div className={styles.popover__content__buttons}>
              <Popover.Close asChild>
                <Button buttonType="default" text="Cancelar" type="button" />
              </Popover.Close>
              <Button buttonType="primary" text="OK" type="submit" />
            </div>
          </Popover.Content>
        </form>
      </Popover.Portal>
    </Popover.Root>
  );
}
