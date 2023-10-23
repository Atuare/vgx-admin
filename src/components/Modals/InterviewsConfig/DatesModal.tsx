import { AddCircle, Close, EditSquare } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { DataInput } from "@/components/DataInput";
import { IconButton } from "@/components/IconButton";
import { IDate } from "@/interfaces/configInterviews.interface";
import { DatesModalSchema } from "@/schemas/configInterviewsSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import dayjs from "dayjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./InterviewsConfig.module.scss";

interface IDatesModalProps {
  defaultValue?: IDate;
  handleOnSubmit: (data: any) => void;
  create?: boolean;
}

export function DatesModal({
  defaultValue,
  handleOnSubmit,
  create,
}: IDatesModalProps) {
  const [open, setOpen] = useState(false);
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(DatesModalSchema),
    defaultValues: {
      date: defaultValue?.date
        ? dayjs(defaultValue?.date).format("YYYY-MM-DD")
        : "",
      description: defaultValue?.description ?? "",
    },
  });

  function handleOnSave(data: any) {
    setOpen(false);
    reset();

    const date = data.date.split("/");
    date.reverse();
    const newDate = date.join("/");

    handleOnSubmit({
      ...data,
      date: dayjs(newDate).toISOString(),
    });
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
              text="Nova Data"
              icon={<AddCircle />}
              type="button"
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
                {defaultValue?.date
                  ? `${dayjs(defaultValue?.date).format(
                      "DD/MM/YYYY",
                    )} - Editar Data`
                  : "Nova Data"}
                <Dialog.Close asChild>
                  <span>
                    <Close />
                  </span>
                </Dialog.Close>
              </Dialog.Title>

              <div className={`${styles.modal__content__form} ${styles.dates}`}>
                <DataInput name="Data" error={errors.date?.message}>
                  <input type="date" {...register("date")} />
                </DataInput>

                <DataInput
                  name="Descrição"
                  error={errors.description?.message}
                  width="100%"
                >
                  <input type="text" {...register("description")} />
                </DataInput>
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
