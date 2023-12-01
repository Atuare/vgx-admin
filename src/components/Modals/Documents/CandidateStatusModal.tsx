import { Close } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { IDocument } from "@/interfaces/document.interface";
import { candidateStatusModalSchema } from "@/schemas/documentModalSchema";
import {
  candidateStatusModalOptions,
  candidateStatusModalReasons,
  convertDocumentStatus,
} from "@/utils/documents";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./Modal.module.scss";

interface CandidateStatusModal {
  handleOnSubmit?: (data: any) => void;
  candidate: IDocument;
  children: ReactNode;
}

export function CandidateStatusModal({
  handleOnSubmit,
  children,
  candidate,
}: CandidateStatusModal) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string>(candidate.status);

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(candidateStatusModalSchema),
    defaultValues: {
      status: candidate.status,
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
      <Dialog.Trigger asChild>
        <span>{children}</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <div className={styles.modal}>
          <Dialog.Overlay className={styles.modal__overlay} />
          <Dialog.Content className={styles.modal__content}>
            <form onSubmit={handleSubmit(handleOnSave)}>
              <Dialog.Title className={styles.modal__title}>
                Alterar Status - {candidate.name}
                <Dialog.Close asChild>
                  <span>
                    <Close />
                  </span>
                </Dialog.Close>
              </Dialog.Title>

              <div className={styles.modal__content__form}>
                <Controller
                  control={control}
                  name="status"
                  render={({ field: { onChange }, fieldState: { error } }) => (
                    <div className={styles.modal__content__form__item}>
                      <label>Status</label>
                      <Select
                        options={candidateStatusModalOptions}
                        placeholder="Selecione"
                        defaultValue={
                          convertDocumentStatus[
                            candidate.status as keyof typeof convertDocumentStatus
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
                      field: { onChange },
                      fieldState: { error },
                    }) => (
                      <div className={styles.modal__content__form__item}>
                        <label>Motivo</label>
                        <Select
                          options={candidateStatusModalReasons}
                          placeholder="Selecione"
                          maxHeight={250}
                          onChange={({ id }) => onChange(id)}
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
