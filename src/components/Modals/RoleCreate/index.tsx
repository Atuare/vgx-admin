import { AddCircle, Close, EditSquare } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { roleModalConfigSchema } from "@/schemas/configRecordsSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./RoleCreate.module.scss";

interface IRole {
  roleText: string;
  roleDescription: string;
}

interface RoleModalProps {
  defaultValue?: IRole;
  handleOnSubmit: (data: any) => void;
  create?: boolean;
}

export function RoleModal({
  defaultValue,
  handleOnSubmit,
  create,
}: RoleModalProps) {
  const [open, setOpen] = useState(false);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(roleModalConfigSchema),
    defaultValues: {
      roleText: defaultValue?.roleText ?? "",
      roleDescription: defaultValue?.roleDescription ?? "",
    },
  });

  function handleOnSave(data: any) {
    setOpen(false);
    reset();
    handleOnSubmit(data);
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={val => {
        setOpen(val);
        if (!val) reset();
      }}
    >
      <Dialog.Trigger asChild>
        <span>
          {create ? (
            <Button
              buttonType="primary"
              text="Novo Cargo"
              icon={<AddCircle />}
            />
          ) : (
            <IconButton buttonType="edit" icon={<EditSquare />} />
          )}
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <div className={styles.modal}>
          <Dialog.Overlay className={styles.modal__overlay} />
          <Dialog.Content className={styles.modal__content}>
            <form onSubmit={handleSubmit(handleOnSave)}>
              <Dialog.Title className={styles.modal__title}>
                {defaultValue?.roleText
                  ? `${defaultValue?.roleText} - Cargo`
                  : "Novo Cargo"}
                <Dialog.Close asChild>
                  <span>
                    <Close />
                  </span>
                </Dialog.Close>
              </Dialog.Title>

              <div className={styles.modal__content__form}>
                <div className={styles.modal__content__form__item}>
                  <label htmlFor="role">Cargo</label>
                  <input
                    id="role"
                    type="text"
                    defaultValue={defaultValue?.roleText}
                    {...register("roleText")}
                  />
                  <span className={styles.error}>
                    {errors.roleText && errors.roleText.message}
                  </span>
                </div>

                <div className={styles.modal__content__form__item}>
                  <label htmlFor="description">Descrição</label>
                  <input
                    id="description"
                    type="text"
                    defaultValue={defaultValue?.roleDescription}
                    {...register("roleDescription")}
                  />
                  <span className={styles.error}>
                    {errors.roleDescription && errors.roleDescription.message}
                  </span>
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
