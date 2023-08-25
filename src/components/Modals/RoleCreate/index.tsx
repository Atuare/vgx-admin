import { Close } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { roleModalConfigSchema } from "@/schemas/configRecordsSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./RoleCreate.module.scss";

interface IRole {
  roleText: string;
  roleDescription: string;
}

interface RoleModalProps {
  title?: string;
  defaultValue?: IRole;
  handleOnSubmit: (data: any) => void;
  children?: React.ReactNode;
}

export function RoleModal({
  defaultValue,
  handleOnSubmit,
  title,
  children,
}: RoleModalProps) {
  const [data, setData] = useState<IRole | undefined>(defaultValue);
  const [open, setOpen] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(roleModalConfigSchema),
    defaultValues: {
      roleText: data?.roleText ?? "",
      roleDescription: data?.roleDescription ?? "",
    },
  });

  function handleOnSave(data: any) {
    setOpen(false);
    handleOnSubmit(data);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal className={styles.modal}>
        <Dialog.Overlay className={styles.modal__overlay} />
        <Dialog.Content className={styles.modal__content}>
          <form onSubmit={handleSubmit(handleOnSave)}>
            <Dialog.Title className={styles.modal__title}>
              {data?.roleText ? `${data?.roleText} - Cargo` : "Novo Cargo"}
              <Dialog.Close asChild>
                <span>
                  <Close />
                </span>
              </Dialog.Close>
            </Dialog.Title>

            <div className={styles.modal__content__form}>
              <Controller
                name="roleText"
                control={control}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={styles.modal__content__form__item}>
                    <label htmlFor="role">Cargo</label>
                    <input
                      id="role"
                      type="text"
                      defaultValue={data?.roleText}
                      onChange={onChange}
                    />
                    <span className={styles.error}>
                      {error?.message && error.message}
                    </span>
                  </div>
                )}
              />

              <Controller
                name="roleDescription"
                control={control}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={styles.modal__content__form__item}>
                    <label htmlFor="description">Descrição</label>
                    <input
                      id="description"
                      type="text"
                      defaultValue={data?.roleDescription}
                      onChange={onChange}
                    />
                    <span className={styles.error}>
                      {error?.message && error.message}
                    </span>
                  </div>
                )}
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
