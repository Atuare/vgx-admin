import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { ReactNode } from "react";
import { Button } from "../Button";
import styles from "./SaveModal.module.scss";

export function SaveModal({
  children,
  handleOnSave,
  icon,
  buttonText,
  text,
}: {
  children: ReactNode;
  handleOnSave: () => void;
  text: string;
  buttonText: string;
  icon: ReactNode;
}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <span>{children}</span>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={styles.modal__overlay} />
        <AlertDialog.Content className={styles.modal__content}>
          <AlertDialog.Title className={styles.modal__title}>
            {text}
          </AlertDialog.Title>
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
            <AlertDialog.Action asChild onClick={handleOnSave}>
              <span>
                <Button text={buttonText} buttonType="primary" icon={icon} />
              </span>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
