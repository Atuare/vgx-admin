import {
  Cancel,
  CheckCircle,
  Close,
  FilterAlt,
  Unchecked,
  Warning,
} from "@/assets/Icons";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { useTableParams } from "@/hooks/useTableParams";
import * as Popover from "@radix-ui/react-popover";
import { useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";
import styles from "./CandidateStatusFilterButton.module.scss";

interface CandidateStatusFilterButtonProps {
  column: string;
}

const icons = {
  checkcircle: <CheckCircle />,
  unchecked: <Unchecked />,
  warning: <Warning />,
  cancel: <Cancel />,
};

const options = [
  {
    title: "PROVA",
    status: {
      unchecked: ["AREALIZAR", "ANDAMENTO"],
      checkcircle: ["APROVADO"],
      cancel: ["NAOREALIZADO", "REPROVADO"],
    },
  },
  {
    title: "ENTREVISTA",
    status: {
      unchecked: ["AREALIZAR"],
      checkcircle: ["APROVADO"],
      cancel: ["NAOREALIZADO"],
    },
  },
  {
    title: "DOCUMENTOS",
    status: {
      unchecked: ["AREALIZAR"],
      checkcircle: ["APROVADO"],
      warning: ["VERIFICACAO"],
      cancel: ["NAOREALIZADO"],
    },
  },
  {
    title: "TREINAMENTO",
    status: {
      unchecked: ["EM_ANDAMENTO"],
      checkcircle: ["CONCLUIDO"],
      cancel: ["SUSPENSO"],
    },
  },
  {
    title: "EXAMES ADM.",
    status: {
      unchecked: ["EM_ANDAMENTO"],
      checkcircle: ["CONCLUIDO"],
      cancel: ["SUSPENSO"],
    },
  },
  {
    title: "ASS. CONTRATO",
    status: {
      unchecked: ["EM_ANDAMENTO"],
      checkcircle: ["CONCLUIDO"],
      cancel: ["SUSPENSO"],
    },
  },
];

export function CandidateStatusFilterButton({
  column,
}: CandidateStatusFilterButtonProps) {
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = (value: boolean) => setOpenFilter(value);

  return (
    <div
      className={styles.container}
      data-state={openFilter ? "active" : "inactive"}
    >
      <PopoverFilter
        handleOpenFilter={handleOpenFilter}
        openFilter={openFilter}
        column={column}
      >
        <button
          className={styles.button}
          onClick={() => setOpenFilter(prev => !prev)}
        >
          <div className={styles.iconContainer}>
            <FilterAlt />
          </div>
          Status
        </button>
      </PopoverFilter>
    </div>
  );
}

export function PopoverFilter({
  children,
  handleOpenFilter,
  column,
  openFilter,
}: {
  children: ReactNode;
  handleOpenFilter: (value: boolean) => void;
  column: string;
  openFilter: boolean;
}) {
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
    setParams(column, selected.join(","));
    handleOpenFilter(false);
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
      open={openFilter}
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
              {options?.map(option =>
                Object.entries(option.status).map(([key, optionValue]) => {
                  return (
                    <Checkbox
                      iconType="solid"
                      isActive={selected.includes(
                        `${option.title}-${optionValue}`,
                      )}
                      value={option.title}
                      icon={icons[key as keyof typeof icons]}
                      onChangeCheckbox={value =>
                        handleCreateFilter(
                          value,
                          `${option.title}-${optionValue}`,
                        )
                      }
                      key={crypto.randomUUID()}
                    />
                  );
                }),
              )}
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
