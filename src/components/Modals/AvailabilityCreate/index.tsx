import { AddCircle, Close, EditSquare } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { DataInput } from "@/components/DataInput";
import { IconButton } from "@/components/IconButton";
import { Select } from "@/components/Select";
import { availabilityModalConfigSchema } from "@/schemas/configRecordsSchema";
import { decimalToTime, hourToDecimal } from "@/utils/formatTimeRange";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./AvailabilityCreate.module.scss";

interface IAvailability {
  startHour: string;
  endHour: string;
  shift: "MANHÃ" | "TARDE" | "NOITE";
  description: string;
}

interface AvailabilityModalProps {
  defaultValue?: IAvailability;
  handleOnSubmit: (data: any) => void;
  create?: boolean;
}

const shiftOptions = [
  {
    name: "Manhã",
    id: "MANHÃ",
  },
  {
    name: "Tarde",
    id: "TARDE",
  },
  {
    name: "Noite",
    id: "NOITE",
  },
];

export function AvailabilityModal({
  defaultValue,
  handleOnSubmit,
  create,
}: AvailabilityModalProps) {
  const [open, setOpen] = useState(false);

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(availabilityModalConfigSchema),
    defaultValues: {
      startHour: defaultValue?.startHour
        ? decimalToTime(Number(defaultValue?.startHour))
        : "",
      endHour: defaultValue?.endHour
        ? decimalToTime(Number(defaultValue?.endHour))
        : "",
      shift: defaultValue?.shift ?? "",
      description: defaultValue?.description ?? "",
    },
  });

  function handleOnSave(data: any) {
    setOpen(false);
    handleOnSubmit({
      startHour: Number(hourToDecimal(data.startHour)),
      endHour: Number(hourToDecimal(data.endHour)),
      shift: data.shift,
      description: data.description,
    });
    reset();
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={val => {
        setOpen(val);
        if (!open) reset();
      }}
    >
      <Dialog.Trigger asChild>
        <span>
          {create ? (
            <Button
              buttonType="primary"
              text="Nova Disponibilidade"
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
                  ? `Editar Disponibilidade`
                  : "Nova Disponibilidade"}
                <Dialog.Close asChild>
                  <span>
                    <Close />
                  </span>
                </Dialog.Close>
              </Dialog.Title>

              <div className={styles.modal__content__form}>
                <Controller
                  name="shift"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <div className={styles.modal__content__form__item}>
                      <DataInput name="Período" error={error?.message}>
                        <Select
                          options={shiftOptions}
                          placeholder="Selecione"
                          onChange={({ id }) => onChange(id)}
                          defaultValue={
                            shiftOptions.find(item => item.id === value)?.name
                          }
                        />
                      </DataInput>
                    </div>
                  )}
                />

                <div className={styles.modal__content__form__item}>
                  <DataInput
                    name="Hora inicial"
                    error={errors?.startHour?.message}
                  >
                    <input
                      type="time"
                      id="Hora inicial"
                      {...register("startHour")}
                    />
                  </DataInput>
                </div>

                <div className={styles.modal__content__form__item}>
                  <DataInput name="Hora final" error={errors?.endHour?.message}>
                    <input
                      type="time"
                      id="Hora final"
                      {...register("endHour")}
                    />
                  </DataInput>
                </div>

                <div className={styles.modal__content__form__item}>
                  <DataInput
                    name="Descrição"
                    error={errors?.description?.message}
                  >
                    <input id="Descrição" {...register("description")} />
                  </DataInput>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "flex-end",
                  paddingTop: 20,
                }}
              >
                <Dialog.Close asChild>
                  <Button text="Cancelar" buttonType="default" />
                </Dialog.Close>

                <Button text="Salvar" buttonType="primary" />
              </div>
            </form>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
