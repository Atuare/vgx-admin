import { TaskAlt } from "@/assets/Icons";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { ReactNode } from "react";
import { Button } from "../../Button";
import styles from "./DeleteModal.module.scss";

export function ReleaseAssessmentModal({
  children,
  handleOnRelease,
  name,
}: {
  children: ReactNode;
  handleOnRelease: () => void;
  name: string;
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
            Permitir acesso a avaliação {name} ?
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
            <AlertDialog.Action asChild onClick={handleOnRelease}>
              <span>
                <Button
                  text="Permitir acesso"
                  buttonType="primary"
                  icon={<TaskAlt />}
                />
              </span>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
