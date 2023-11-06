import { Close } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { trainingModalStatusSchema } from "@/schemas/trainingSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./TrainingStatus.module.scss";

const status = [
  {
    id: "EM_ANDAMENTO",
    name: "Em andamento",
  },
  {
    id: "CONCLUÍDO",
    name: "Concluído",
  },
  {
    id: "CANCELADO",
    name: "Cancelado",
  },
  {
    id: "SUSPENSO",
    name: "Suspenso",
  },
];

interface TrainingStatusModalProps {
  handleOnSubmit: (data: any) => void;
  children: ReactNode;
}

export function TrainingStatusModal({
  handleOnSubmit,
  children,
}: TrainingStatusModalProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(trainingModalStatusSchema),
  });

  function handleOnSave(data: any) {
    setOpen(false);
    handleOnSubmit(data);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <span>{children}</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.modal__overlay} />
        <Dialog.Content className={styles.modal__content}>
          <form onSubmit={handleSubmit(handleOnSave)}>
            <Dialog.Title className={styles.modal__title}>
              Alterar status
              <Dialog.Close asChild>
                <span>
                  <Close />
                </span>
              </Dialog.Close>
            </Dialog.Title>

            <div className={styles.modal__content__form}>
              <Controller
                name="status"
                control={control}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={styles.modal__content__form__item}>
                    <label htmlFor="reason">Motivo</label>
                    <Select
                      onChange={({ name, id }) => {
                        setSelected(name);
                        onChange(id);
                      }}
                      options={status}
                      placeholder="Selecione"
                      width="100%"
                    />
                    <span className={styles.error}>
                      {error?.message && error.message}
                    </span>
                  </div>
                )}
              />
            </div>

            {selected !== "Concluído" && selected.trim() !== "" && (
              <div className={styles.modal__content__form}>
                <Controller
                  name="reason"
                  control={control}
                  render={({ field: { onChange }, fieldState: { error } }) => (
                    <div className={styles.modal__content__form__item}>
                      <label htmlFor="reason">Motivo</label>
                      <input id="reason" type="text" onChange={onChange} />
                      <span className={styles.error}>
                        {error?.message && error.message}
                      </span>
                    </div>
                  )}
                />
              </div>
            )}

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
