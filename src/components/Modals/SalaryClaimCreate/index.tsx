import { Close } from "@/assets/Icons";
import { Button } from "@/components/Button";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import styles from "./SalaryClaimCreate.module.scss";

interface ISalaryClaim {
  fromAmount: string;
  toAmount: string;
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

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal className={styles.modal}>
        <Dialog.Overlay className={styles.modal__overlay} />
        <Dialog.Content className={styles.modal__content}>
          <Dialog.Title className={styles.modal__title}>
            {data ? "Editar Pretensão Salarial" : "Nova Pretensão Salarial"}
            <Dialog.Close asChild>
              <span>
                <Close />
              </span>
            </Dialog.Close>
          </Dialog.Title>

          <div className={styles.modal__content__form}>
            <div>
              <label htmlFor="fromAmount">De</label>
              <input
                id="fromAmount"
                type="number"
                defaultValue={data?.fromAmount}
              />
            </div>

            <div>
              <label htmlFor="toAmount">Para</label>
              <input
                id="toAmount"
                type="number"
                defaultValue={data?.toAmount}
              />
            </div>
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
              <Button text="Cancelar" buttonType="default" />
            </Dialog.Close>
            <Dialog.Close asChild onClick={handleOnSubmit}>
              <Button text="Salvar" buttonType="primary" />
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
