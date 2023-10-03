import { AddCircle, Close, EditSquare } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { FileInput } from "@/components/FileInput";
import { IconButton } from "@/components/IconButton";
import { IContract } from "@/interfaces/contract.interface";
import { contractConfigModalConfigSchema } from "@/schemas/configContractsSchema";
import { base64ToFile } from "@/utils/base64ToFile";
import { getBase64 } from "@/utils/getBase64";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
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
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(contractConfigModalConfigSchema),
    defaultValues: {
      name: defaultValue?.name ?? "",
      description: defaultValue?.description ?? "",
      document: defaultValue?.document ?? "",
      hasChilds: defaultValue?.hasChilds ?? false,
      transportVoucher: defaultValue?.transportVoucher ?? false,
    },
  });
  const [file, setFile] = useState<File>();

  function handleOnSave(data: any) {
    setOpen(false);
    handleOnSubmit(data);
    reset();
  }

  async function convertBase64ToFile(base64: string, filename: string) {
    const convertedFile = await base64ToFile(base64, filename);
    setFile(convertedFile);
  }

  useEffect(() => {
    if (defaultValue?.document) {
      convertBase64ToFile(defaultValue.document, defaultValue.name);
    }
  }, [defaultValue]);

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
      <Dialog.Portal>
        <div className={styles.modal}>
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
                        onChange={async file => {
                          const base64File: any = await getBase64(file);
                          onChange(base64File);
                          setFile(file);
                        }}
                        width="383px"
                        allowedTypes={["pdf"]}
                        maxSize={5}
                        defaultFile={file}
                      />
                      <a
                        href={file && URL.createObjectURL(file)}
                        target="_blank"
                        style={{ width: 125 }}
                      >
                        Visualizar aquivo
                      </a>
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
                    className={
                      styles.modal__content__form__criterias__checkboxes
                    }
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
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
