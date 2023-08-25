import { Close } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import styles from "./SchoolingCreate.module.scss";

interface ISchooling {
  schoolingName: string;
  informCourse: boolean;
}

interface SchoolingModalProps {
  title?: string;
  defaultValue?: ISchooling;
  handleOnSubmit: (data: any) => void;
  children?: React.ReactNode;
}

export function SchoolingModal({
  defaultValue,
  handleOnSubmit,
  title,
  children,
}: SchoolingModalProps) {
  const [data, setData] = useState<ISchooling | undefined>(defaultValue);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal className={styles.modal}>
        <Dialog.Overlay className={styles.modal__overlay} />
        <Dialog.Content className={styles.modal__content}>
          <Dialog.Title className={styles.modal__title}>
            {data
              ? `${data?.schoolingName} - Escolaridade`
              : "Nova Escolaridade"}
            <Dialog.Close asChild>
              <span>
                <Close />
              </span>
            </Dialog.Close>
          </Dialog.Title>

          <div className={styles.modal__content__form}>
            <div>
              <label htmlFor="schooling">Escolaridade</label>
              <input
                id="schooling"
                type="text"
                defaultValue={data?.schoolingName}
              />
            </div>

            <Checkbox
              iconType="solid"
              value="Informar curso"
              isActive={data?.informCourse}
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
