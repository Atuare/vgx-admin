import { Close } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { candidateTrainingModalStatusSchema } from "@/schemas/trainingSchema";
import { useGetAllExamsQuery } from "@/services/api/fetchApi";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./TrainingStatus.module.scss";

const status = [
  {
    id: "APROVADO",
    name: "Aprovado",
  },
  {
    id: "PENDENTE",
    name: "Pendente",
  },
  {
    id: "DESISTENTE",
    name: "Desistente",
  },
  {
    id: "REPROVADO",
    name: "Reprovado",
  },
];

const reasons = [
  {
    id: "AVALIAÇÃO",
    name: "Avaliação",
  },
  {
    id: "FREQUÊNCIA",
    name: "Frequência",
  },
  {
    id: "PERFIL",
    name: "Perfil",
  },
  {
    id: "COMPORTAMENTO",
    name: "Comportamento",
  },
];

interface TrainingStatusModalProps {
  handleOnSubmit: (data: any) => void;
  candidateName: string;
  children: ReactNode;
}

export function CandidateTrainingStatusModal({
  handleOnSubmit,
  candidateName,
  children,
}: TrainingStatusModalProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(candidateTrainingModalStatusSchema),
  });
  const [examsData, setExamsData] = useState([]);

  const { data, isFetching, isSuccess } = useGetAllExamsQuery({});

  function handleOnSave(data: any) {
    setOpen(false);
    handleOnSubmit(data);
  }

  useEffect(() => {
    if (isSuccess && data) {
      const examsDataWithName = data.data?.map((exam: any) => ({
        ...exam,
        name: exam.examiner,
      }));
      setExamsData(examsDataWithName);
    }
  }, [isSuccess, isFetching]);

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <span>{children}</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.modal__overlay} />
        <Dialog.Content className={styles.modal__content}>
          <form onSubmit={handleSubmit(handleOnSave)}>
            <Dialog.Title className={styles.modal__title}>
              Alterar status{" - "}
              {candidateName.length > 33
                ? `${candidateName.slice(0, 33)}...`
                : candidateName}
              <Dialog.Close asChild>
                <span>
                  <Close />
                </span>
              </Dialog.Close>
            </Dialog.Title>

            <div className={styles.modal__content__form}>
              <Controller
                name="status"
                control={control}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={styles.modal__content__form__item}>
                    <label htmlFor="reason">Status</label>
                    <Select
                      onChange={({ name, id }) => {
                        setSelected(name);
                        onChange(id);
                      }}
                      options={status}
                      placeholder="Selecione"
                      width="100%"
                    />
                    <span className={styles.error}>
                      {error?.message && error.message}
                    </span>
                  </div>
                )}
              />
            </div>

            {selected !== "Aprovado" && selected.trim() !== "" ? (
              <div className={styles.modal__content__form}>
                <Controller
                  name="reason"
                  control={control}
                  render={({ field: { onChange }, fieldState: { error } }) => (
                    <div className={styles.modal__content__form__item}>
                      <label htmlFor="reason">Motivo</label>
                      <Select
                        options={reasons}
                        onChange={v => onChange(v.name)}
                        placeholder="Selecione"
                      />
                      <span className={styles.error}>
                        {error?.message && error.message}
                      </span>
                    </div>
                  )}
                />
              </div>
            ) : (
              <div className={styles.modal__content__form}>
                <Controller
                  name="class"
                  control={control}
                  render={({ field: { onChange }, fieldState: { error } }) => (
                    <div className={styles.modal__content__form__item}>
                      <label htmlFor="class">
                        Indicar turma Exame Admissional
                      </label>
                      <Select
                        options={examsData}
                        onChange={v => onChange(v.id)}
                        placeholder="Selecione"
                      />
                      <span className={styles.error}>
                        {error?.message && error.message}
                      </span>
                    </div>
                  )}
                />
              </div>
            )}

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
