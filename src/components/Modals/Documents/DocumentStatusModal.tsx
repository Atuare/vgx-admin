import { Close } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { FileInput } from "@/components/FileInput";
import { Select } from "@/components/Select";
import { ICandidateDocument } from "@/interfaces/document.interface";
import { documentStatusModalSchema } from "@/schemas/documentModalSchema";
import {
  convertDocumentStatus,
  documentStatusModalOptions,
} from "@/utils/documents";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./Modal.module.scss";

interface DocumentStatusModalProps {
  handleOnSubmit?: (data: any) => void;
  document: ICandidateDocument;
  children: ReactNode;
}

export function DocumentStatusModal({
  handleOnSubmit,
  children,
  document,
}: DocumentStatusModalProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string>(document.status);

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(documentStatusModalSchema),
    defaultValues: {
      status: document.status,
    },
  });

  function handleOnSave(data: any) {
    setOpen(false);
    handleOnSubmit?.(data);
  }

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild className={styles.trigger}>
        <span>{children}</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <div className={styles.modal}>
          <Dialog.Overlay className={styles.modal__overlay} />
          <Dialog.Content className={styles.modal__content}>
            <form onSubmit={handleSubmit(handleOnSave)}>
              <Dialog.Title className={styles.modal__title}>
                Alterar Status - {document.name}
                <Dialog.Close asChild>
                  <span>
                    <Close />
                  </span>
                </Dialog.Close>
              </Dialog.Title>

              <div className={styles.modal__content__form}>
                <div className={styles.modal__content__form__item}>
                  <label>Baixar arquivo</label>
                  <div className={styles.form__file}>
                    <FileInput disabled width={"396px"} />
                    <a href="#">Visualizar arquivo</a>
                  </div>
                </div>

                <Controller
                  control={control}
                  name="status"
                  render={({ field: { onChange }, fieldState: { error } }) => (
                    <div className={styles.modal__content__form__item}>
                      <label>Status</label>
                      <Select
                        options={documentStatusModalOptions}
                        placeholder="Selecione"
                        defaultValue={
                          convertDocumentStatus[
                            document.status as keyof typeof convertDocumentStatus
                          ]
                        }
                        onChange={({ id }) => {
                          onChange(id);
                          setStatus(id);
                        }}
                      />
                      <span className={styles.error}>{error?.message}</span>
                    </div>
                  )}
                />

                {status !== "APROVADO" && status ? (
                  <Controller
                    control={control}
                    name="reason"
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <div className={styles.modal__content__form__item}>
                        <label htmlFor="reason">Motivo</label>
                        <input
                          type="text"
                          id="reason"
                          onChange={e => onChange(e.target.value)}
                          value={value}
                        />
                        <span className={styles.error}>{error?.message}</span>
                      </div>
                    )}
                  />
                ) : null}
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
