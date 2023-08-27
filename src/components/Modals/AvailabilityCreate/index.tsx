import { AddCircle, Close, EditSquare } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { Select } from "@/components/Select";
import { availabilityModalConfigSchema } from "@/schemas/configRecordsSchema";
import { getDayOfWeekName } from "@/utils/dates";
import { decimalToTime, hourToDecimal } from "@/utils/formatTimeRange";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./AvailabilityCreate.module.scss";

interface IAvailability {
  startDay: number;
  endDay: number;
  startHour: number;
  endHour: number;
}

interface AvailabilityModalProps {
  defaultValue?: IAvailability;
  handleOnSubmit: (data: any) => void;
  create?: boolean;
}

const daysOfWeek = [
  {
    name: "Domingo",
    id: "Dom",
  },
  {
    name: "Segunda",
    id: "Seg",
  },
  {
    name: "Terça",
    id: "Ter",
  },
  {
    name: "Quarta",
    id: "Qua",
  },
  {
    name: "Quinta",
    id: "Qui",
  },
  {
    name: "Sexta",
    id: "Sex",
  },
  {
    name: "Sábado",
    id: "Sáb",
  },
];

const dayOfWeek: Record<string, number> = {
  Dom: 0,
  Seg: 1,
  Ter: 2,
  Qua: 3,
  Qui: 4,
  Sex: 5,
  Sáb: 6,
};

export function AvailabilityModal({
  defaultValue,
  handleOnSubmit,
  create,
}: AvailabilityModalProps) {
  const [data, setData] = useState<IAvailability | undefined>(defaultValue);
  const [open, setOpen] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(availabilityModalConfigSchema),
    defaultValues: {
      startDay: data?.startDay ? String(data?.startDay) : "",
      endDay: data?.endDay ? String(data?.endDay) : "",
      startHour: data?.startHour ? String(data?.startHour) : "",
      endHour: data?.endHour ? String(data?.endHour) : "",
    },
  });

  function handleOnSave(data: any) {
    setOpen(false);
    handleOnSubmit({
      startHour: Number(data.startHour),
      endHour: Number(data.endHour),
      startDay: Number(data.startDay),
      endDay: Number(data.endDay),
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <span>
          {create ? (
            <Button
              buttonType="primary"
              text="Nova Habilidade"
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
              {data ? `Editar Disponibilidade` : "Nova Disponibilidade"}
              <Dialog.Close asChild>
                <span>
                  <Close />
                </span>
              </Dialog.Close>
            </Dialog.Title>

            <div className={styles.modal__content__form}>
              <Controller
                name="startDay"
                control={control}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={styles.modal__content__form__item}>
                    <label htmlFor="startDate">Data inicial</label>
                    <Select
                      options={daysOfWeek}
                      placeholder="Selecione"
                      onChange={({ id }) => onChange(dayOfWeek[id])}
                      defaultValue={getDayOfWeekName(data?.startDay)}
                    />
                    <span className={styles.error}>
                      {error?.message && error.message}
                    </span>
                  </div>
                )}
              />

              <Controller
                name="startHour"
                control={control}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={styles.modal__content__form__item}>
                    <label htmlFor="startHour">Hora inicial</label>
                    <input
                      type="time"
                      id="startHour"
                      onChange={e =>
                        onChange(hourToDecimal(String(e.target.value)))
                      }
                      defaultValue={
                        data?.startHour && decimalToTime(data?.startHour)
                      }
                    />
                    <span className={styles.error}>
                      {error?.message && error.message}
                    </span>
                  </div>
                )}
              />

              <Controller
                name="endDay"
                control={control}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={styles.modal__content__form__item}>
                    <label htmlFor="endDate">Data final</label>
                    <Select
                      options={daysOfWeek}
                      placeholder="Selecione"
                      onChange={({ id }) => onChange(dayOfWeek[id])}
                      defaultValue={getDayOfWeekName(data?.endDay)}
                    />
                    <span className={styles.error}>
                      {error?.message && error.message}
                    </span>
                  </div>
                )}
              />

              <Controller
                name="endHour"
                control={control}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={styles.modal__content__form__item}>
                    <label htmlFor="endHour">Hora final</label>
                    <input
                      type="time"
                      id="endHour"
                      onChange={e =>
                        onChange(hourToDecimal(String(e.target.value)))
                      }
                      defaultValue={
                        data?.endHour && decimalToTime(data?.endHour)
                      }
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
                <Button text="Cancelar" buttonType="default" />
              </Dialog.Close>

              <Button text="Salvar" buttonType="primary" />
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
