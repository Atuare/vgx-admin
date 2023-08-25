import { Close } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { salaryClaimModalConfigSchema } from "@/schemas/configRecordsSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./SalaryClaimCreate.module.scss";

interface ISalaryClaim {
  fromAmount: number;
  toAmount: number;
}

interface SalaryClaimModalProps {
  defaultValue?: ISalaryClaim;
  handleOnSubmit: (data: any) => void;
  children?: React.ReactNode;
}

export function SalaryClaimModal({
  defaultValue,
  handleOnSubmit,
  children,
}: SalaryClaimModalProps) {
  const [data, setData] = useState<ISalaryClaim | undefined>(defaultValue);
  const [open, setOpen] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(salaryClaimModalConfigSchema),
    defaultValues: {
      fromAmount: data?.fromAmount ?? 0,
      toAmount: data?.toAmount ?? 0,
    },
  });

  function handleOnSave(data: any) {
    setOpen(false);
    handleOnSubmit(data);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal className={styles.modal}>
        <Dialog.Overlay className={styles.modal__overlay} />
        <Dialog.Content className={styles.modal__content}>
          <form onSubmit={handleSubmit(handleOnSave)}>
            <Dialog.Title className={styles.modal__title}>
              {data ? "Editar Pretensão Salarial" : "Nova Pretensão Salarial"}
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
                      type="number"
                      defaultValue={data?.fromAmount}
                      onChange={onChange}
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
                    <label htmlFor="toAmount">Para</label>
                    <input
                      id="toAmount"
                      type="number"
                      defaultValue={data?.toAmount}
                      onChange={onChange}
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
      </Dialog.Portal>
    </Dialog.Root>
  );
}
