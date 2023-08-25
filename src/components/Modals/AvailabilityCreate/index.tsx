import { Close } from "@/assets/Icons";
import { Button } from "@/components/Button";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import styles from "./AvailabilityCreate.module.scss";

interface IAvailability {
  startDay: number;
  endDay: number;
  startHour: number;
  endHour: number;
}

interface AvailabilityModalProps {
  title?: string;
  defaultValue?: IAvailability;
  handleOnSubmit: (data: any) => void;
  children?: React.ReactNode;
}

export function AvailabilityModal({
  defaultValue,
  handleOnSubmit,
  title,
  children,
}: AvailabilityModalProps) {
  const [data, setData] = useState<IAvailability | undefined>(defaultValue);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal className={styles.modal}>
        <Dialog.Overlay className={styles.modal__overlay} />
        <Dialog.Content className={styles.modal__content}>
          <Dialog.Title className={styles.modal__title}>
            {data ? `Editar Disponibilidade` : "Nova Disponibilidade"}
            <Dialog.Close asChild>
              <span>
                <Close />
              </span>
            </Dialog.Close>
          </Dialog.Title>

          <div className={styles.modal__content__form}>
            <div>
              <label htmlFor="startDate">Data inicial</label>
              <input type="date" id="startDate" />
            </div>

            <div>
              <label htmlFor="startHour">Hora inicial</label>
              <input type="time" id="startHour" />
            </div>

            <div>
              <label htmlFor="endDate">Data final</label>
              <input type="date" id="endDate" />
            </div>

            <div>
              <label htmlFor="endHour">Hora final</label>
              <input type="time" id="endHour" />
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
