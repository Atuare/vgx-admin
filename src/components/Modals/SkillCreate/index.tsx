import { AddCircle, Close, EditSquare } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { skillModalConfigSchema } from "@/schemas/configRecordsSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./SkillCreate.module.scss";

interface ISkill {
  skillText: string;
}

interface SkillModalProps {
  defaultValue?: ISkill;
  handleOnSubmit: (data: any) => void;
  create?: boolean;
}

export function SkillModal({
  defaultValue,
  handleOnSubmit,
  create,
}: SkillModalProps) {
  const [open, setOpen] = useState(false);
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(skillModalConfigSchema),
    defaultValues: {
      skillText: defaultValue?.skillText ?? "",
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
              text="Nova Habilidade"
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
                {defaultValue?.skillText
                  ? `${defaultValue?.skillText} - Habilidade`
                  : "Nova Habilidade"}
                <Dialog.Close asChild>
                  <span>
                    <Close />
                  </span>
                </Dialog.Close>
              </Dialog.Title>

              <div className={styles.modal__content__form}>
                <div className={styles.modal__content__form__item}>
                  <label htmlFor="acronym">Habilidade</label>
                  <input
                    id="acronym"
                    type="text"
                    defaultValue={defaultValue?.skillText}
                    {...register("skillText")}
                  />
                  <span className={styles.error}>
                    {errors.skillText && errors.skillText.message}
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
