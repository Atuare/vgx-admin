import { AddCircle, Close, EditSquare } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { salaryClaimModalConfigSchema } from "@/schemas/configRecordsSchema";
import { formatCurrency } from "@/utils/formatCurrency";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./SalaryClaimCreate.module.scss";

interface ISalaryClaim {
  fromAmount: number;
  toAmount: number;
}

interface SalaryClaimModalProps {
  defaultValue?: ISalaryClaim;
  handleOnSubmit: (data: any) => void;
  create?: boolean;
}

export function SalaryClaimModal({
  defaultValue,
  handleOnSubmit,
  create,
}: SalaryClaimModalProps) {
  const [open, setOpen] = useState(false);
  const [toAmount, setToAmount] = useState(
    defaultValue?.toAmount
      ? formatCurrency(String(defaultValue?.toAmount))
      : formatCurrency("0"),
  );
  const [fromAmount, setFromAmount] = useState(
    defaultValue?.fromAmount
      ? formatCurrency(String(defaultValue?.fromAmount))
      : formatCurrency("0"),
  );

  const { control, handleSubmit, reset, trigger, watch } = useForm({
    resolver: yupResolver(salaryClaimModalConfigSchema),
    defaultValues: {
      fromAmount: defaultValue?.fromAmount ? defaultValue?.fromAmount : 0,
      toAmount: defaultValue?.toAmount ? defaultValue?.toAmount : 0,
    },
  });

  function handleOnSave(data: any) {
    setOpen(false);
    handleOnSubmit({
      fromAmount: Number(data.fromAmount),
      toAmount: Number(data.toAmount),
    });
    setToAmount(formatCurrency("0"));
    setFromAmount(formatCurrency("0"));
    reset();
  }

  function parseCurrency(currencyString: string): number {
    const numericString = currencyString.replace(/\D/g, "");
    const numericValue = parseFloat(numericString) / 100;

    return numericValue;
  }

  useEffect(() => {
    if (watch("fromAmount") && watch("toAmount")) {
      trigger("fromAmount");
      trigger("toAmount");
    }
  }, [watch("fromAmount"), watch("toAmount")]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={val => {
        setOpen(val);
        if (!val) {
          reset();
          setToAmount(formatCurrency("0"));
          setFromAmount(formatCurrency("0"));
        }
      }}
    >
      <Dialog.Trigger asChild>
        <span>
          {create ? (
            <Button
              buttonType="primary"
              text="Nova Pretensão Salarial"
              icon={<AddCircle />}
            />
          ) : (
            <IconButton buttonType="edit" icon={<EditSquare />} />
          )}
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <div className={styles.modal}>
          <Dialog.Overlay className={styles.modal__overlay} />
          <Dialog.Content className={styles.modal__content}>
            <form onSubmit={handleSubmit(handleOnSave)}>
              <Dialog.Title className={styles.modal__title}>
                {defaultValue
                  ? "Editar Pretensão Salarial"
                  : "Nova Pretensão Salarial"}
                <Dialog.Close asChild>
                  <span>
                    <Close />
                  </span>
                </Dialog.Close>
              </Dialog.Title>

              <div className={styles.modal__content__form}>
                <Controller
                  name="fromAmount"
                  control={control}
                  render={({ field: { onChange }, fieldState: { error } }) => (
                    <div className={styles.modal__content__form__item}>
                      <label htmlFor="fromAmount">De</label>
                      <input
                        id="fromAmount"
                        type="text"
                        onChange={e => {
                          onChange(parseCurrency(e.target.value));
                          setFromAmount(formatCurrency(e.target.value));
                        }}
                        value={fromAmount}
                      />
                      <span className={styles.error}>
                        {error?.message && error.message}
                      </span>
                    </div>
                  )}
                />

                <Controller
                  name="toAmount"
                  control={control}
                  render={({ field: { onChange }, fieldState: { error } }) => (
                    <div className={styles.modal__content__form__item}>
                      <label htmlFor="toAmount">Até</label>
                      <input
                        id="toAmount"
                        type="text"
                        onChange={e => {
                          onChange(parseCurrency(e.target.value));
                          setToAmount(formatCurrency(e.target.value));
                        }}
                        value={toAmount}
                      />
                      <span className={styles.error}>
                        {error?.message && error.message}
                      </span>
                    </div>
                  )}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "flex-end",
                  padding: 10,
                }}
              >
                <Dialog.Close asChild>
                  <Button text="Cancelar" buttonType="default" type="button" />
                </Dialog.Close>

                <Button text="Salvar" buttonType="primary" type="submit" />
              </div>
            </form>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
