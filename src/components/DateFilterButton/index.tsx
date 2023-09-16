import { Close, FilterAlt } from "@/assets/Icons";
import { useTableParams } from "@/hooks/useTableParams";
import * as Popover from "@radix-ui/react-popover";
import { Table } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";
import { Button } from "../Button";
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
  const [inputValue, setInputValue] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);

  const { get } = useSearchParams();
  const { setParams } = useTableParams();

  const handleCreateFilter = (_value: boolean, name?: string) => {
    if (selected.includes(name!)) {
      setSelected(prev => prev.filter(item => item !== name));
    } else {
      setSelected(prev => [...prev, name!]);
    }
  };

  const handleToggleFilter = () => {
    table?.getColumn(column)?.setFilterValue(selected);

    setParams(column, selected.join(","));
  };

  const getFilterValues = () => {
    const paramsValue = get(column);
    if (paramsValue) {
      const paramsArray = paramsValue.split(",");
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
      <Popover.Portal className={styles.popover}>
        <Popover.Content className={styles.popover__content} sideOffset={5}>
          <header>
            <Popover.Close className={styles.popover__close} aria-label="Close">
              <Close />
            </Popover.Close>
          </header>

          <div className={styles.popover__content__list}>
            <div>
              De <input type="date" />
            </div>

            <div>
              Até <input type="date" />
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
      </Popover.Portal>
    </Popover.Root>
  );
}
