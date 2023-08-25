import { Close } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { unitModalConfigSchema } from "@/schemas/configRecordsSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./UnitCreate.module.scss";

interface IUnit {
  unitAcronym: string;
  unitName: string;
  unitAddress: string;
}

interface UnitModalProps {
  title?: string;
  defaultValue?: IUnit;
  handleOnSubmit: (data: any) => void;
  children?: React.ReactNode;
}

export function UnitModal({
  defaultValue,
  handleOnSubmit,
  title,
  children,
}: UnitModalProps) {
  const [unitData, setUnitData] = useState<IUnit | undefined>(defaultValue);
  const [open, setOpen] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(unitModalConfigSchema),
    defaultValues: {
      unitAcronym: unitData?.unitAcronym ?? "",
      unitName: unitData?.unitName ?? "",
      unitAddress: unitData?.unitAddress ?? "",
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
              {unitData ? `${unitData?.unitAcronym} - Unidade` : "Nova Unidade"}
              <Dialog.Close asChild>
                <span>
                  <Close />
                </span>
              </Dialog.Close>
            </Dialog.Title>

            <div className={styles.modal__content__form}>
              <Controller
                name="unitAcronym"
                control={control}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={styles.modal__content__form__item}>
                    <label htmlFor="acronym">Sigla</label>
                    <input
                      id="acronym"
                      type="text"
                      defaultValue={unitData?.unitAcronym}
                      onChange={onChange}
                    />
                    <span className={styles.error}>
                      {error?.message && error.message}
                    </span>
                  </div>
                )}
              />

              <Controller
                name="unitName"
                control={control}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={styles.modal__content__form__item}>
                    <label htmlFor="name">Nome</label>
                    <input
                      id="name"
                      type="text"
                      defaultValue={unitData?.unitName}
                      onChange={onChange}
                    />
                    <span className={styles.error}>
                      {error?.message && error.message}
                    </span>
                  </div>
                )}
              />

              <Controller
                name="unitAddress"
                control={control}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={styles.modal__content__form__item}>
                    <label htmlFor="address">Endereço</label>
                    <input
                      id="address"
                      type="text"
                      defaultValue={unitData?.unitAddress}
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
