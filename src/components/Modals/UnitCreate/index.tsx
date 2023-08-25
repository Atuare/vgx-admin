import { Close } from "@/assets/Icons";
import { Button } from "@/components/Button";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import styles from "./UnitCreate.module.scss";

interface IUnit {
  unitAcronym: string;
  unitName: string;
  unitAddress: string;
}

interface UnitModalProps {
  title?: string;
  defaultValue?: IUnit;
  handleOnSubmit: (data: any) => void;
  children?: React.ReactNode;
}

export function UnitModal({
  defaultValue,
  handleOnSubmit,
  title,
  children,
}: UnitModalProps) {
  const [data, setData] = useState<IUnit | undefined>(defaultValue);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal className={styles.modal}>
        <Dialog.Overlay className={styles.modal__overlay} />
        <Dialog.Content className={styles.modal__content}>
          <Dialog.Title className={styles.modal__title}>
            {data?.unitAcronym
              ? `${data?.unitAcronym} - Unidade`
              : "Nova Unidade"}
            <Dialog.Close asChild>
              <span>
                <Close />
              </span>
            </Dialog.Close>
          </Dialog.Title>

          <div className={styles.modal__content__form}>
            <div>
              <label htmlFor="acronym">Sigla</label>
              <input
                id="acronym"
                type="text"
                defaultValue={data?.unitAcronym}
              />
            </div>

            <div>
              <label htmlFor="name">Nome</label>
              <input id="name" type="text" defaultValue={data?.unitName} />
            </div>

            <div>
              <label htmlFor="address">Endereço</label>
              <input
                id="address"
                type="text"
                defaultValue={data?.unitAddress}
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
