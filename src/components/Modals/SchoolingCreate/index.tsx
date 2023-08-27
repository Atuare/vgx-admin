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
  const [data, setData] = useState<ISchooling | undefined>(defaultValue);
  const [open, setOpen] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schoolingModalConfigSchema),
    defaultValues: {
      schoolingName: data?.schoolingName ?? "",
      informCourse: data?.informCourse ?? false,
    },
  });

  function handleOnSave(data: any) {
    setOpen(false);
    handleOnSubmit(data);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
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
      <Dialog.Portal className={styles.modal}>
        <Dialog.Overlay className={styles.modal__overlay} />
        <Dialog.Content className={styles.modal__content}>
          <form onSubmit={handleSubmit(handleOnSave)}>
            <Dialog.Title className={styles.modal__title}>
              {data
                ? `${data?.schoolingName} - Escolaridade`
                : "Nova Escolaridade"}
              <Dialog.Close asChild>
                <span>
                  <Close />
                </span>
              </Dialog.Close>
            </Dialog.Title>

            <div className={styles.modal__content__form}>
              <Controller
                name="schoolingName"
                control={control}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={styles.modal__content__form__item}>
                    <label htmlFor="schooling">Escolaridade</label>
                    <input
                      id="schooling"
                      type="text"
                      defaultValue={data?.schoolingName}
                      onChange={onChange}
                    />
                    <span className={styles.error}>
                      {error?.message && error.message}
                    </span>
                  </div>
                )}
              />

              <Controller
                name="informCourse"
                control={control}
                render={({ field: { onChange } }) => (
                  <Checkbox
                    iconType="solid"
                    value="Informar curso"
                    isActive={data?.informCourse}
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
      </Dialog.Portal>
    </Dialog.Root>
  );
}
