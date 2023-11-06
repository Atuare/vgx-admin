import { Close } from "@/assets/Icons";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import styles from "./InterviewCandidateEdit.module.scss";

interface InterviewCandidateEditModalProps {
  defaultValue?: any;
  handleOnSubmit: (data: any) => void;
}

export function InterviewCandidateEditModal({
  handleOnSubmit,
  defaultValue,
}: InterviewCandidateEditModalProps) {
  const [candidateData, setCandidateData] = useState<any>(defaultValue);
  const [open, setOpen] = useState(false);

  function handleOnSave(data: any) {
    setOpen(false);
    handleOnSubmit(data);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <span>
          <h1>Teste</h1>
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.modal__overlay} />
        <Dialog.Content className={styles.modal__content}>
          {/* <form onSubmit={handleSubmit(handleOnSave)}> */}
          <Dialog.Title className={styles.modal__title}>
            {candidateData?.candidateName
              ? `${candidateData?.candidateName} - Candidato`
              : "Novo Candidato"}
            <Dialog.Close asChild>
              <span>
                <Close />
              </span>
            </Dialog.Close>
          </Dialog.Title>
          {/* </form> */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
