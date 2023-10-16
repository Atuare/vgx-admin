import { AddCircle, Close, EditSquare } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { unitModalConfigSchema } from "@/schemas/configRecordsSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./UnitCreate.module.scss";

interface IUnit {
  unitAcronym: string;
  unitName: string;
  unitAddress: string;
}

interface UnitModalProps {
  defaultValue?: IUnit;
  handleOnSubmit: (data: any) => void;
  create?: boolean;
}

export function UnitModal({
  defaultValue,
  handleOnSubmit,
  create,
}: UnitModalProps) {
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(unitModalConfigSchema),
    defaultValues: {
      unitAcronym: defaultValue?.unitAcronym ?? "",
      unitName: defaultValue?.unitName ?? "",
      unitAddress: defaultValue?.unitAddress ?? "",
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
              text="Nova Unidade"
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
                {defaultValue
                  ? `${defaultValue?.unitAcronym} - Unidade`
                  : "Nova Unidade"}
                <Dialog.Close asChild>
                  <span>
                    <Close />
                  </span>
                </Dialog.Close>
              </Dialog.Title>

              <div className={styles.modal__content__form}>
                <div className={styles.modal__content__form__item}>
                  <label htmlFor="acronym">Sigla</label>
                  <input
                    id="acronym"
                    type="text"
                    defaultValue={defaultValue?.unitAcronym}
                    {...register("unitAcronym")}
                  />
                  <span className={styles.error}>
                    {errors.unitAcronym && errors.unitAcronym.message}
                  </span>
                </div>

                <div className={styles.modal__content__form__item}>
                  <label htmlFor="name">Nome</label>
                  <input
                    id="name"
                    type="text"
                    defaultValue={defaultValue?.unitName}
                    {...register("unitName")}
                  />
                  <span className={styles.error}>
                    {errors.unitName && errors.unitName.message}
                  </span>
                </div>

                <div className={styles.modal__content__form__item}>
                  <label htmlFor="address">Endereço</label>
                  <input
                    id="address"
                    type="text"
                    defaultValue={defaultValue?.unitAddress}
                    {...register("unitAddress")}
                  />
                  <span className={styles.error}>
                    {errors.unitAddress && errors.unitAddress.message}
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
