import { AddCircle, Close, EditSquare } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { IconButton } from "@/components/IconButton";
import { IConfigDocument } from "@/interfaces/configDocument.interface";
import { documentConfigModalConfigSchema } from "@/schemas/configDocumentsSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./DocumentsConfig.module.scss";

interface DocumentsConfigModalProps {
  defaultValue?: IConfigDocument;
  handleOnSubmit: (data: any) => void;
  create?: boolean;
}

export function DocumentsConfigModal({
  defaultValue,
  handleOnSubmit,
  create,
}: DocumentsConfigModalProps) {
  const [open, setOpen] = useState(false);
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(documentConfigModalConfigSchema),
    defaultValues: {
      name: defaultValue?.name ?? "",
      childrens: defaultValue?.childrens ?? false,
      eighteenYears: defaultValue?.eighteenYears ?? false,
      man: defaultValue?.man ?? false,
      mandatory: defaultValue?.mandatory ?? false,
      married: defaultValue?.married ?? false,
    },
  });

  function handleOnSave(data: any) {
    setOpen(false);
    handleOnSubmit(data);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <span>
          {create ? (
            <Button
              buttonType="primary"
              text="Novo Documento"
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
                ? `${defaultValue?.name} - Documento`
                : "Novo Documento"}
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
                    <label htmlFor="document">Documento</label>
                    <input
                      id="document"
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
                name="mandatory"
                control={control}
                render={({ field: { onChange } }) => (
                  <Checkbox
                    iconType="solid"
                    value="Documento obrigatório"
                    onChangeCheckbox={value => onChange(value)}
                    style={{ fontWeight: "700", padding: 0 }}
                  />
                )}
              />

              <div className={styles.modal__content__form__checkboxes}>
                <h1>Critérios de envio</h1>

                <div className={styles.modal__content__form__checkboxes__list}>
                  <Controller
                    name="man"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <Checkbox
                        iconType="solid"
                        value="Homens"
                        onChangeCheckbox={value => onChange(value)}
                        style={{ padding: 0, width: "auto" }}
                      />
                    )}
                  />

                  <Controller
                    name="eighteenYears"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <Checkbox
                        iconType="solid"
                        value="Maior de 18 anos"
                        onChangeCheckbox={value => onChange(value)}
                        style={{ padding: 0, width: "auto" }}
                      />
                    )}
                  />

                  <Controller
                    name="married"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <Checkbox
                        iconType="solid"
                        value="Casado(a)"
                        onChangeCheckbox={value => onChange(value)}
                        style={{ padding: 0, width: "auto" }}
                      />
                    )}
                  />

                  <Controller
                    name="childrens"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <Checkbox
                        iconType="solid"
                        value="Ter filhos"
                        onChangeCheckbox={value => onChange(value)}
                        style={{ padding: 0, width: "auto" }}
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
