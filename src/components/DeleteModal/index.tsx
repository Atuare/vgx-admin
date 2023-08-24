import { Delete } from "@/assets/Icons";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { ReactNode } from "react";
import { Button } from "../Button";
import styles from "./DeleteModal.module.scss";

export function DeleteModal({
  children,
  handleOnDelete,
  name,
}: {
  children: ReactNode;
  handleOnDelete: () => void;
  name: string;
}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <span>{children}</span>
      </AlertDialog.Trigger>
      <AlertDialog.Portal className={styles.modal}>
        <AlertDialog.Overlay className={styles.modal__overlay} />
        <AlertDialog.Content className={styles.modal__content}>
          <AlertDialog.Title className={styles.modal__title}>
            Deseja excluir {name}?
          </AlertDialog.Title>
          <AlertDialog.Description className={styles.modal__description}>
            Após a exclusão não será possível recuperar estas informações.
          </AlertDialog.Description>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              padding: 10,
            }}
          >
            <AlertDialog.Cancel asChild>
              <span>
                <Button text="Cancelar" buttonType="default" />
              </span>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild onClick={handleOnDelete}>
              <span>
                <Button text="Excluir" buttonType="error" icon={<Delete />} />
              </span>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
