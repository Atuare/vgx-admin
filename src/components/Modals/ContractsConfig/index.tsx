import { AddCircle, Close, EditSquare } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { FileInput } from "@/components/FileInput";
import { IconButton } from "@/components/IconButton";
import { IContract } from "@/interfaces/contract.interface";
import { contractConfigModalConfigSchema } from "@/schemas/configContractsSchema";
import { getBase64 } from "@/utils/getBase64";
import { Toast } from "@/utils/toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { ChangeEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./ContractModal.module.scss";

interface ContractModalProps {
  defaultValue?: IContract;
  handleOnSubmit: (data: any) => void;
  create?: boolean;
}

export function ContractConfigModal({
  defaultValue,
  handleOnSubmit,
  create,
}: ContractModalProps) {
  const [open, setOpen] = useState(false);
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(contractConfigModalConfigSchema),
    defaultValues: {
      name: defaultValue?.name ?? "",
      description: defaultValue?.description ?? "",
      document: defaultValue?.document ?? "",
      hasChilds: defaultValue?.hasChilds ?? false,
      transportVoucher: defaultValue?.transportVoucher ?? false,
    },
  });
  const [base64Picture, setBase64Picture] = useState<string>();

  function handleOnSave(data: any) {
    setOpen(false);
    handleOnSubmit(data);
  }

  const handlePictureChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const type = file.type;
    const size = file.size;

    if (type !== "image/png" && type !== "image/jpeg" && type !== "image/jpg") {
      Toast("error", "O arquivo deve ser uma imagem png, jpg ou jpeg.");

      event.target.value = "";
      return;
    }

    if (size > 5000000) {
      Toast("error", "O arquivo deve ter no máximo 5MB.");

      event.target.value = "";
      return;
    }

    const base64File: any = await getBase64(file);

    setBase64Picture(base64File);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <span>
          {create ? (
            <Button
              buttonType="primary"
              text="Novo Contrato"
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
              {defaultValue?.name
                ? `${defaultValue?.name} - Contrato`
                : "Novo Contrato"}
              <Dialog.Close asChild>
                <span>
                  <Close />
                </span>
              </Dialog.Close>
            </Dialog.Title>

            <div className={styles.modal__content__form}>
              <Controller
                name="name"
                control={control}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={styles.modal__content__form__item}>
                    <label htmlFor="name">Nome</label>
                    <input
                      id="name"
                      type="text"
                      defaultValue={defaultValue?.name}
                      onChange={onChange}
                    />
                    <span className={styles.error}>
                      {error?.message && error.message}
                    </span>
                  </div>
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={styles.modal__content__form__item}>
                    <label htmlFor="desc">Descrição</label>
                    <input
                      id="desc"
                      type="text"
                      defaultValue={defaultValue?.description}
                      onChange={onChange}
                    />
                    <span className={styles.error}>
                      {error?.message && error.message}
                    </span>
                  </div>
                )}
              />

              <Controller
                name="document"
                control={control}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className={styles.modal__content__form__item}>
                    <label htmlFor="desc">Upload documento</label>
                    <FileInput
                      onChange={file => onChange(getBase64(file))}
                      width="383px"
                    />
                    <a href="">Visualizar aquivo</a>
                    <span className={styles.error}>
                      {error?.message && error.message}
                    </span>
                  </div>
                )}
              />

              <div className={styles.modal__content__form__criterias}>
                <h1 className={styles.modal__content__form__criterias__title}>
                  Critérios de envio
                </h1>
                <div
                  className={styles.modal__content__form__criterias__checkboxes}
                >
                  <Controller
                    name="transportVoucher"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <Checkbox
                        iconType="solid"
                        value="Optante VT"
                        isActive={defaultValue?.transportVoucher}
                        onChangeCheckbox={onChange}
                        type="button"
                      />
                    )}
                  />

                  <Controller
                    name="hasChilds"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <Checkbox
                        iconType="solid"
                        value="Ter filhos"
                        isActive={defaultValue?.hasChilds}
                        onChangeCheckbox={onChange}
                        type="button"
                      />
                    )}
                  />
                </div>
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
      </Dialog.Portal>
    </Dialog.Root>
  );
}
