import { Close, FilterAlt } from "@/assets/Icons";
import { useTableParams } from "@/hooks/useTableParams";
import { Toast } from "@/utils/toast";
import * as Popover from "@radix-ui/react-popover";
import { Table } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "../../../Button";
import styles from "./DateFilterButton.module.scss";

interface DateFilterButtonProps {
  title: string;
  table: Table<any> | undefined;
  column: string;
}

export function DateFilterButton({
  title,
  table,
  column,
}: DateFilterButtonProps) {
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
}: {
  children: ReactNode;
  handleOpenFilter: (value: boolean) => void;
  table: Table<any> | undefined;
  column: string;
}) {
  const [firstDate, setFirstDate] = useState<string>("");
  const [secondDate, setSecondDate] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);

  const { get } = useSearchParams();
  const { setParams } = useTableParams();

  const handleToggleFilter = () => {
    if (!firstDate && !secondDate) {
      table?.getColumn(column)?.setFilterValue([]);
      return;
    }

    if (dayjs(firstDate).isAfter(dayjs(secondDate))) {
      Toast("error", "A data inicial não pode ser maior que a data final");
      return;
    } else if (dayjs(secondDate).isBefore(dayjs(firstDate))) {
      Toast("error", "A data final não pode ser menor que a data inicial");
      return;
    }

    setSelected([firstDate, secondDate]);
    table?.getColumn(column)?.setFilterValue([firstDate, secondDate]);
    setParams(column, [firstDate, secondDate].join(","));
  };

  const getFilterValues = () => {
    const paramsValue = get(column);
    if (paramsValue) {
      const paramsArray = paramsValue.split(",");
      setFirstDate(paramsArray[0]);
      setSecondDate(paramsArray[1]);
      setSelected(paramsArray);
    }
  };

  return (
    <Popover.Root
      onOpenChange={open => {
        handleOpenFilter(open);
        if (open) {
          getFilterValues();
        }
      }}
    >
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <div className={styles.popover}>
          <Popover.Content className={styles.popover__content} sideOffset={5}>
            <header>
              <Popover.Close
                className={styles.popover__close}
                aria-label="Close"
              >
                <Close />
              </Popover.Close>
            </header>

            <div className={styles.popover__content__list}>
              <div>
                De{" "}
                <input
                  type="date"
                  onChange={e => setFirstDate(e.target.value)}
                  value={firstDate}
                />
              </div>

              <div>
                Até{" "}
                <input
                  type="date"
                  onChange={e => setSecondDate(e.target.value)}
                  value={secondDate}
                />
              </div>
            </div>

            <div className={styles.popover__content__buttons}>
              <Popover.Close asChild>
                <Button buttonType="default" text="Cancelar" />
              </Popover.Close>
              <Button
                buttonType="primary"
                text="OK"
                onClick={handleToggleFilter}
              />
            </div>
          </Popover.Content>
        </div>
      </Popover.Portal>
    </Popover.Root>
  );
}
