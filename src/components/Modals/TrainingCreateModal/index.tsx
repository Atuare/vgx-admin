import { AddCircle, Close, EditSquare } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { IQuestion } from "@/interfaces/training.interface";
import { trainingCreateModalConfigSchema } from "@/schemas/trainingSchema";
import { Toast } from "@/utils/toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./TrainingCreateModal.module.scss";

interface TrainingCreateModalProps {
  defaultValue?: IQuestion;
  handleOnSubmit: (data: any) => void;
  create?: boolean;
}

export function TrainingCreateModal({
  defaultValue,
  handleOnSubmit,
  create = false,
}: TrainingCreateModalProps) {
  const [data, setData] = useState<IQuestion | undefined>(defaultValue);
  const [correct, setCorrect] = useState<number | undefined>();
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(trainingCreateModalConfigSchema),
    defaultValues: {
      firstOption: data?.alternatives?.[0]?.alternative,
      secondOption: data?.alternatives?.[1]?.alternative,
      thirdOption: data?.alternatives?.[2]?.alternative,
      fourthOption: data?.alternatives?.[3]?.alternative,
      text: data?.question,
    },
  });

  function handleOnSave(data: any) {
    setCorrect(undefined);
    setOpen(false);
    reset();
    const question = {
      id: crypto.randomUUID(),
      question: data.text,
      alternatives: [
        {
          alternative: data.firstOption,
          isCorrect: data.correctOption === 0,
        },
        {
          alternative: data.secondOption,
          isCorrect: data.correctOption === 1,
        },
        {
          alternative: data.thirdOption,
          isCorrect: data.correctOption === 2,
        },
        {
          alternative: data.fourthOption,
          isCorrect: data.correctOption === 3,
        },
      ],
    };
    handleOnSubmit(question);
  }

  useEffect(() => {
    if (!open) {
      reset();
      setCorrect(undefined);
    }
  }, [open]);

  useEffect(() => {
    if (typeof correct !== "undefined") {
      setValue("correctOption", correct);
    }
  }, [correct]);

  useEffect(() => {
    if (errors.correctOption && errors.correctOption.message) {
      Toast("error", errors.correctOption.message);
    }
  }, [errors]);

  useEffect(() => {
    if (data) {
      setCorrect(
        data.alternatives
          .map(alternative => alternative.isCorrect)
          .indexOf(true),
      );
    }
  }, [data]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <span>
          {create ? (
            <Button
              buttonType="primary"
              text="Nova questão"
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
            <div>
              <Dialog.Title className={styles.modal__title}>
                {create ? " Nova questão" : "Editar questão"}
                <Dialog.Close asChild>
                  <span>
                    <Close />
                  </span>
                </Dialog.Close>
              </Dialog.Title>

              <div className={styles.modal__content__form}>
                <Controller
                  name="text"
                  control={control}
                  render={({ field: { onChange }, fieldState: { error } }) => (
                    <div className={styles.modal__content__form__item}>
                      <label htmlFor="text">Texto questão</label>
                      <input
                        id="text"
                        type="text"
                        defaultValue={data?.question}
                        onChange={onChange}
                      />
                      <span className={styles.error}>
                        {error?.message && error.message}
                      </span>
                    </div>
                  )}
                />

                <div className={styles.alternativeContainer}>
                  <Controller
                    control={control}
                    name="firstOption"
                    render={({
                      field: { onChange },
                      fieldState: { error },
                    }) => (
                      <Alternative
                        active={correct}
                        index={0}
                        onChangeAlternative={setCorrect}
                        onChangeText={onChange}
                        error={error?.message}
                        alternative={data?.alternatives[0].alternative}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="secondOption"
                    render={({
                      field: { onChange },
                      fieldState: { error },
                    }) => (
                      <Alternative
                        active={correct}
                        index={1}
                        onChangeAlternative={setCorrect}
                        onChangeText={onChange}
                        error={error?.message}
                        alternative={data?.alternatives[1].alternative}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="thirdOption"
                    render={({
                      field: { onChange },
                      fieldState: { error },
                    }) => (
                      <Alternative
                        active={correct}
                        index={2}
                        onChangeAlternative={setCorrect}
                        onChangeText={onChange}
                        error={error?.message}
                        alternative={data?.alternatives[2].alternative}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="fourthOption"
                    render={({
                      field: { onChange },
                      fieldState: { error },
                    }) => (
                      <Alternative
                        active={correct}
                        index={3}
                        onChangeAlternative={setCorrect}
                        onChangeText={onChange}
                        error={error?.message}
                        alternative={data?.alternatives[3].alternative}
                      />
                    )}
                  />
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

                <Button
                  text="Salvar"
                  buttonType="primary"
                  type="button"
                  onClick={handleSubmit(handleOnSave)}
                />
              </div>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Alternative({
  active,
  index,
  onChangeAlternative,
  onChangeText,
  alternative,
  error,
}: {
  active: number | null | undefined;
  index: number;
  onChangeAlternative?: (index: number) => void;
  onChangeText?: (value: string) => void;
  alternative?: string;
  error?: string;
}) {
  return (
    <div className={styles.modal__content__form__item}>
      <label htmlFor={alternative}>Opção {index + 1}</label>
      <input
        type="text"
        id={alternative}
        defaultValue={alternative}
        onChange={e => onChangeText?.(e.target.value)}
      />
      <span className={styles.error}>{error && error}</span>
      <div
        className={styles.radio}
        onClick={() => onChangeAlternative?.(index)}
      >
        <div
          className={`${styles.radio__thumb} ${
            active === index ? styles.checked : ""
          }`}
        >
          <div />
        </div>
        <span>Alternativa correta</span>
      </div>
    </div>
  );
}
