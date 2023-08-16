import { ReactNode, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import styles from "./FilterButton.module.scss";
import {
  CheckboxBlank,
  CheckboxFill,
  Close,
  FilterAlt,
  Search,
} from "@/assets/Icons";
import { SearchInput } from "../SearchInput";
import { Button } from "../Button";

interface FilterButtonProps {
  title: string;
}

export function FilterButton({ title }: FilterButtonProps) {
  const [openFilter, setOpenFilter] = useState(false);

  const handleFilterValue = (value: boolean) => setOpenFilter(value);

  return (
    <div
      className={styles.container}
      data-state={openFilter ? "active" : "inactive"}
    >
      <PopoverFilter handleFilterValue={handleFilterValue}>
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
  handleFilterValue,
}: {
  children: ReactNode;
  handleFilterValue: (value: boolean) => void;
}) {
  function handleChangeValue(open: boolean) {
    handleFilterValue(open);
  }

  function handleChangeInputValue(value: string) {}

  return (
    <Popover.Root onOpenChange={handleChangeValue}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal className={styles.popover}>
        <Popover.Content className={styles.popover__content} sideOffset={5}>
          <header>
            <SearchInput
              handleChangeValue={handleChangeInputValue}
              icon={<Search />}
            />
            <Popover.Close className={styles.popover__close} aria-label="Close">
              <Close />
            </Popover.Close>
          </header>

          <div className={styles.popover__content__list}>
            <FilterListItem title="Instrutor treinamentos" />
            <FilterListItem title="Instrutor treinamentos" />
            <FilterListItem title="Instrutor treinamentos" />
            <FilterListItem title="Instrutor treinamentos" />
            <FilterListItem title="Instrutor treinamentos" />
            <FilterListItem title="Instrutor treinamentos" />
          </div>

          <div className={styles.popover__content__buttons}>
            <Popover.Close asChild>
              <Button buttonType="default" text="Cancelar" />
            </Popover.Close>
            <Button buttonType="primary" text="OK" />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function FilterListItem({ title }: { title: string }) {
  const [checked, setChecked] = useState(false);

  return (
    <button onClick={() => setChecked(prev => !prev)}>
      {checked ? <CheckboxFill /> : <CheckboxBlank />}
      <p>{title}</p>
    </button>
  );
}
