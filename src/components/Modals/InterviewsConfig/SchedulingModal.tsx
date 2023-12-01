import { AddCircle, Close, EditSquare } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { DataInput } from "@/components/DataInput";
import { IconButton } from "@/components/IconButton";
import { Select } from "@/components/Select";
import { IScheduling } from "@/interfaces/configInterviews.interface";
import { SchedulingModalSchema } from "@/schemas/configInterviewsSchema";
import { convertDayOfWeek, daysOfWeekInEnglish } from "@/utils/dates";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import dayjs from "dayjs";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./InterviewsConfig.module.scss";

interface SchedulingModalProps {
  defaultValue?: IScheduling;
  handleOnSubmit: (data: any) => void;
  create?: boolean;
}

export function SchedulingModal({
  defaultValue,
  handleOnSubmit,
  create,
}: SchedulingModalProps) {
  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SchedulingModalSchema),
    defaultValues: {
      date: defaultValue?.date ? dayjs(defaultValue?.date).format("HH:mm") : "",
      schedulingLimit: defaultValue?.schedulingLimit ?? 0,
      dayOfWeek: defaultValue?.dayOfWeek ?? "",
    },
  });

  function handleOnSave(data: any) {
    setOpen(false);
    reset();
    handleOnSubmit({
      ...data,
      date: dayjs()
        .set("hour", Number(data.date.split(":")[0]))
        .set("minute", Number(data.date.split(":")[1]))
        .toISOString(),
      schedulingLimit: Number(data.schedulingLimit),
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
              text="Novo Horário"
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
            <form>
              <Dialog.Title className={styles.modal__title}>
                {defaultValue?.date
                  ? `${dayjs(defaultValue?.date).format(
                      "HH:mm",
                    )} - Editar horário`
                  : "Novo Horário"}
                <Dialog.Close asChild>
                  <span>
                    <Close />
                  </span>
                </Dialog.Close>
              </Dialog.Title>

              <div className={styles.modal__content__form}>
                <DataInput name="Horário" error={errors.date?.message}>
                  <input type="time" {...register("date")} />
                </DataInput>

                <DataInput
                  name="Limite de Agendamentos"
                  error={errors.schedulingLimit?.message}
                >
                  <input type="number" {...register("schedulingLimit")} />
                </DataInput>

                <Controller
                  control={control}
                  name="dayOfWeek"
                  render={({ field: { onChange, value } }) => (
                    <DataInput
                      name="Dia da Semana"
                      error={errors.dayOfWeek?.message}
                    >
                      <Select
                        onChange={({ id }) => onChange(id)}
                        options={daysOfWeekInEnglish}
                        placeholder="Selecione"
                        value={convertDayOfWeek(value ?? "")}
                      />
                    </DataInput>
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

                <Button
                  text="Salvar"
                  buttonType="primary"
                  type="button"
                  onClick={handleSubmit(handleOnSave)}
                />
              </div>
            </form>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
