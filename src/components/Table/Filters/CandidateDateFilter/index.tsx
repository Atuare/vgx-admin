import { Close, FilterAlt } from "@/assets/Icons";
import { useTableParams } from "@/hooks/useTableParams";
import * as Popover from "@radix-ui/react-popover";
import { useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";
import { Button } from "../../../Button";
import { Checkbox } from "../../../Checkbox";
import styles from "./CandidateDateFilterButton.module.scss";

interface CandidateDateFilterProps {
  column: string;
  handleOnChangeFilter: (value: string) => void;
}

const convertDateFilter = {
  "Data Cadastro": "CADASTRO",
  "Data Prova": "PROVA",
  "Data Entrevista": "ENTREVISTA",
  "Data Treinamento": "TREINAMENTO",
};

const convertDateFilterSelect = {
  CADASTRO: "Data Cadastro",
  PROVA: "Data Prova",
  ENTREVISTA: "Data Entrevista",
  TREINAMENTO: "Data Treinamento",
};

const options = [
  "Data Cadastro",
  "Data Prova",
  "Data Entrevista",
  "Data Treinamento",
];

export function CandidateDateFilter({
  column,
  handleOnChangeFilter,
}: CandidateDateFilterProps) {
  const [openFilter, setOpenFilter] = useState(false);

  const { get } = useSearchParams();

  const [selected, setSelected] = useState<string>(
    get(column)
      ? convertDateFilterSelect[
          get(column) as keyof typeof convertDateFilterSelect
        ]
      : "Data Cadastro",
  );

  const handleOpenFilter = (value: boolean) => setOpenFilter(value);

  const handleChangeSelected = (value: string) => setSelected(value);

  return (
    <div
      className={styles.container}
      data-state={openFilter ? "active" : "inactive"}
      style={{ width: 160 }}
    >
      <PopoverFilter
        handleOpenFilter={handleOpenFilter}
        column={column}
        handleChangeSelected={handleChangeSelected}
        selected={selected}
        handleOnChangeFilter={handleOnChangeFilter}
      >
        <button
          className={styles.button}
          onClick={() => setOpenFilter(prev => !prev)}
        >
          <div className={styles.iconContainer}>
            <FilterAlt />
          </div>
          {selected}
        </button>
      </PopoverFilter>
    </div>
  );
}

export function PopoverFilter({
  children,
  handleOpenFilter,
  column,
  handleChangeSelected,
  selected,
  handleOnChangeFilter,
}: {
  children: ReactNode;
  handleOpenFilter: (value: boolean) => void;
  column: string;
  handleChangeSelected: (value: string) => void;
  selected: string;
  handleOnChangeFilter: (value: string) => void;
}) {
  const [currentValue, setCurrentValue] = useState<string>(selected);

  const { get } = useSearchParams();
  const { setParams } = useTableParams();

  const handleCreateFilter = (_value: boolean, name?: string) => {
    if (currentValue.includes(name!)) {
      setCurrentValue(currentValue);
    } else {
      setCurrentValue(name!);
    }
  };

  const handleToggleFilter = () => {
    setParams(
      column,
      convertDateFilter[currentValue as keyof typeof convertDateFilter],
    );

    handleOnChangeFilter(
      convertDateFilter[currentValue as keyof typeof convertDateFilter],
    );

    handleChangeSelected(currentValue);
  };

  const getFilterValues = () => {
    const paramsValue = get(column);

    if (paramsValue) {
      handleChangeSelected(
        convertDateFilterSelect[
          paramsValue as keyof typeof convertDateFilterSelect
        ],
      );
    }
  };

  return (
    <Popover.Root
      onOpenChange={open => {
        handleOpenFilter(open);
        if (open) {
          getFilterValues();
        } else {
          setCurrentValue(selected);
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
              {options?.map(option => (
                <Checkbox
                  iconType="solid"
                  isActive={currentValue === option}
                  value={option}
                  onChangeCheckbox={handleCreateFilter}
                  key={crypto.randomUUID()}
                  singleSelect
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
