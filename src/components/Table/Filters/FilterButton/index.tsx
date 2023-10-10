import { Close, FilterAlt, Search } from "@/assets/Icons";
import { useTableParams } from "@/hooks/useTableParams";
import * as Popover from "@radix-ui/react-popover";
import { Table } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "../../../Button";
import { Checkbox } from "../../../Checkbox";
import { SearchInput } from "../../../SearchInput";
import styles from "./FilterButton.module.scss";

interface FilterButtonProps {
  title: string;
  table: Table<any> | undefined;
  options: string[];
  column: string;
}

export function FilterButton({
  title,
  table,
  options,
  column,
}: FilterButtonProps) {
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
        options={options}
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
  options,
  table,
  column,
}: {
  children: ReactNode;
  handleOpenFilter: (value: boolean) => void;
  options: string[];
  table: Table<any> | undefined;
  column: string;
}) {
  const [inputValue, setInputValue] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);

  const { get } = useSearchParams();
  const { setParams } = useTableParams();

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(inputValue.toLowerCase()),
  );

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
      <Popover.Portal>
        <div className={styles.popover}>
          <Popover.Content className={styles.popover__content} sideOffset={5}>
            <header>
              <SearchInput
                handleChangeValue={setInputValue}
                icon={<Search />}
              />
              <Popover.Close
                className={styles.popover__close}
                aria-label="Close"
              >
                <Close />
              </Popover.Close>
            </header>

            <div className={styles.popover__content__list}>
              {filteredOptions?.map(option => (
                <Checkbox
                  iconType="solid"
                  isActive={selected.includes(option)}
                  value={option}
                  onChangeCheckbox={handleCreateFilter}
                  key={crypto.randomUUID()}
                />
              ))}
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
