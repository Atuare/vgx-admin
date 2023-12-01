import { AddCircle, Close, EditSquare } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { IconButton } from "@/components/IconButton";
import { schoolingModalConfigSchema } from "@/schemas/configRecordsSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./SchoolingCreate.module.scss";

interface ISchooling {
  schoolingName: string;
  informCourse: boolean;
}

interface SchoolingModalProps {
  defaultValue?: ISchooling;
  handleOnSubmit: (data: any) => void;
  create?: boolean;
}

export function SchoolingModal({
  defaultValue,
  handleOnSubmit,
  create,
}: SchoolingModalProps) {
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schoolingModalConfigSchema),
    defaultValues: {
      schoolingName: defaultValue?.schoolingName ?? "",
      informCourse: defaultValue?.informCourse ?? false,
    },
  });

  function handleOnSave(data: any) {
    setOpen(false);
    handleOnSubmit(data);
    reset();
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
              text="Nova Escolaridade"
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
                  ? `${defaultValue?.schoolingName} - Escolaridade`
                  : "Nova Escolaridade"}
                <Dialog.Close asChild>
                  <span>
                    <Close />
                  </span>
                </Dialog.Close>
              </Dialog.Title>

              <div className={styles.modal__content__form}>
                <div className={styles.modal__content__form__item}>
                  <label htmlFor="schooling">Escolaridade</label>
                  <input
                    id="schooling"
                    type="text"
                    defaultValue={defaultValue?.schoolingName}
                    {...register("schoolingName")}
                  />
                  <span className={styles.error}>
                    {errors.schoolingName && errors.schoolingName.message}
                  </span>
                </div>

                <Controller
                  name="informCourse"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Checkbox
                      iconType="solid"
                      value="Informar curso"
                      isActive={defaultValue?.informCourse}
                      onChangeCheckbox={onChange}
                      type="button"
                    />
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
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
