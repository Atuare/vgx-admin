import { Close } from "@/assets/Icons";
import { FileInput } from "@/components/FileInput";
import { Radio } from "@/components/Radio";
import { Select } from "@/components/Select";
import { genders, maritalStatus, results } from "@/utils/datamodal";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode, useState } from "react";
import styles from "./DataModal.module.scss";

interface DataModalProps {
  children: ReactNode;
}

export function DataModal({ children }: DataModalProps) {
  const [open, setOpen] = useState(false);

  function handleOnSave(data: any) {
    setOpen(false);
  }

  function onChangeGender() {}

  function onChangeMaritalStatus() {}

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <span>{children}</span>
      </Dialog.Trigger>
      <Dialog.Portal className={styles.modal}>
        <Dialog.Overlay className={styles.modal__overlay} />
        <Dialog.Content className={styles.modal__content}>
          <form onSubmit={handleOnSave}>
            <Dialog.Title className={styles.modal__title}>
              Neiriele Sabrina Rocha Souza - Instrutor Treinamentos
              <Dialog.Close asChild>
                <span>
                  <Close />
                </span>
              </Dialog.Close>
            </Dialog.Title>

            <div className={styles.modal__content__form}>
              <section className={styles.modal__content__form__item}>
                <h2 className={styles.modal__content__form__item__title}>
                  Informações pessoais
                </h2>
                <div className={styles.modal__content__form__item__inputs}>
                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Nome">
                      <input type="text" id="Nome" style={{ width: 272 }} />
                    </InputContainer>

                    <InputContainer title="CPF">
                      <input type="text" id="CPF" />
                    </InputContainer>

                    <InputContainer title="Sexo" width={"100%"}>
                      <Select
                        onChange={onChangeGender}
                        placeholder="Selecione"
                        options={genders}
                        width="100%"
                      />
                    </InputContainer>

                    <InputContainer title="Estado civil" width={"100%"}>
                      <Select
                        onChange={onChangeMaritalStatus}
                        placeholder="Selecione"
                        options={maritalStatus}
                      />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer
                      title="Data de nascimento"
                      htmlFor="birthdate"
                    >
                      <input type="text" id="birthdate" />
                    </InputContainer>

                    <InputContainer title="Estado" htmlFor="state">
                      <input type="text" id="state" />
                    </InputContainer>

                    <InputContainer title="Município" htmlFor="city">
                      <input type="text" id="city" />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Whatsapp" htmlFor="whatsapp">
                      <input type="text" id="whatsapp" />
                    </InputContainer>

                    <InputContainer title="Telefone" htmlFor="phone">
                      <input type="text" id="phone" />
                    </InputContainer>

                    <InputContainer title="E-mail" htmlFor="email">
                      <input type="text" id="email" />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer
                      title="Nome completo da mãe"
                      htmlFor="motherName"
                    >
                      <input
                        type="text"
                        style={{ width: 272 }}
                        id="motherName"
                      />
                    </InputContainer>

                    <InputContainer
                      title="Nome completo do pai"
                      htmlFor="fatherName"
                    >
                      <input
                        type="text"
                        style={{ width: 272 }}
                        id="fatherName"
                      />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Possui filhos menores de 14 anos?">
                      <Radio column lightTheme />
                    </InputContainer>

                    <InputContainer title="Número de filhos">
                      <input type="number" style={{ width: 80 }} />
                    </InputContainer>
                  </div>
                </div>
              </section>

              <section className={styles.modal__content__form__item}>
                <h2 className={styles.modal__content__form__item__title}>
                  Endereço
                </h2>
                <div className={styles.modal__content__form__item__inputs}>
                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="CEP">
                      <input type="text" id="CEP" />
                    </InputContainer>

                    <InputContainer title="Logradouro">
                      <input type="text" id="Logradouro" />
                    </InputContainer>

                    <InputContainer title="Endereço">
                      <input type="text" id="Endereço" />
                    </InputContainer>

                    <InputContainer title="Bairro">
                      <input type="text" id="Bairro" />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Número">
                      <input type="number" id="Número" />
                    </InputContainer>

                    <InputContainer title="Complemento">
                      <input type="text" id="Complemento" />
                    </InputContainer>
                  </div>
                </div>
              </section>

              <section className={styles.modal__content__form__item}>
                <h2 className={styles.modal__content__form__item__title}>
                  Documentos pessoais
                </h2>
                <div className={styles.modal__content__form__item__inputs}>
                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="RG">
                      <input type="text" id="RG" />
                    </InputContainer>

                    <InputContainer
                      title="Data de expedição"
                      htmlFor="expeditionDate"
                    >
                      <input type="date" id="expeditionDate" />
                    </InputContainer>

                    <InputContainer title="Órgão expedidor">
                      <input type="text" id="Órgão expedidor" />
                    </InputContainer>

                    <InputContainer title="UF">
                      <input type="text" id="UF" />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Número da CTPS">
                      <input type="text" id="Número da CTPS" />
                    </InputContainer>

                    <InputContainer title="Número do PIS">
                      <input type="text" id="Número do PIS" />
                    </InputContainer>
                  </div>

                  <h1 style={{ fontSize: 17 }}>Conta corrente</h1>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Banco">
                      <input type="text" id="Banco" />
                    </InputContainer>

                    <InputContainer title="Agência">
                      <input type="text" id="Agência" />
                    </InputContainer>

                    <InputContainer title="Conta">
                      <input type="text" id="Conta" />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Tipo chave PIX ">
                      <input type="text" id="Tipo chave PIX " />
                    </InputContainer>

                    <InputContainer title="Chave PIX">
                      <input type="text" id="Chave PIX" />
                    </InputContainer>
                  </div>
                </div>
              </section>

              <section className={styles.modal__content__form__item}>
                <h2 className={styles.modal__content__form__item__title}>
                  Informações complementares
                </h2>
                <div className={styles.modal__content__form__item__inputs}>
                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Possui celular?">
                      <Radio column lightTheme />
                    </InputContainer>

                    <InputContainer title="Possui computador?">
                      <Radio column lightTheme />
                    </InputContainer>

                    <InputContainer title="Possui internet?">
                      <Radio column lightTheme />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Possui objeção em trabalhar algum dia da semana?">
                      <Radio column lightTheme />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Pretensão salarial">
                      <input type="text" id="Pretensão salarial" />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Possui alguma deficiência?">
                      <Radio column lightTheme />
                    </InputContainer>

                    <InputContainer title="Qual?">
                      <input type="text" id="Qual?" />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Possui laudo médico?">
                      <Radio column lightTheme />
                    </InputContainer>

                    <InputContainer title="Anexar arquivo">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 8,
                        }}
                      >
                        <FileInput onChange={() => {}} />
                        <a href="#" style={{ alignSelf: "flex-end" }}>
                          Visualizar documento
                        </a>
                      </div>
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer
                      title="Opta por receber vale transporte?"
                      lightTitle="(vagas presenciais)"
                    >
                      <Radio column lightTheme />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Empresa">
                      <input type="text" id="Empresa" />
                    </InputContainer>

                    <InputContainer title="Linha">
                      <input type="text" id="Linha" />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Tarifa de ida">
                      <input type="number" id="Tarifa de ida" />
                    </InputContainer>

                    <InputContainer title="Tarifa de volta">
                      <input type="number" id="Tarifa de volta" />
                    </InputContainer>

                    <InputContainer title="Tarifa diária">
                      <input type="number" id="Tarifa diária" />
                    </InputContainer>
                  </div>
                </div>
              </section>

              <section className={styles.modal__content__form__item}>
                <h2 className={styles.modal__content__form__item__title}>
                  Disponibilidade
                </h2>
                <div className={styles.modal__content__form__item__inputs}>
                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Disponibilidade">
                      <input type="text" id="Disponibilidade" />
                    </InputContainer>
                  </div>
                </div>
              </section>

              <section className={styles.modal__content__form__item}>
                <h2 className={styles.modal__content__form__item__title}>
                  Formação
                </h2>
                <div className={styles.modal__content__form__item__inputs}>
                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Escolaridade">
                      <input type="text" id="Escolaridade" />
                    </InputContainer>

                    <InputContainer title="Curso">
                      <input type="text" id="Curso" />
                    </InputContainer>

                    <InputContainer title="Status">
                      <input type="text" id="Status" />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Período">
                      <input type="text" id="Período" />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Currículo">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 8,
                        }}
                      >
                        <FileInput onChange={() => {}} />
                        <a href="#" style={{ alignSelf: "flex-end" }}>
                          Visualizar documento
                        </a>
                      </div>
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Resultado">
                      <Select
                        onChange={() => {}}
                        options={results}
                        placeholder="Selecione"
                      />
                    </InputContainer>

                    <InputContainer title="Motivo">
                      <input type="text" id="Motivo" />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Observação" width={"100%"}>
                      <input type="text" id="Observação" />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer
                      title="Entrevistador responsável"
                      width={"100%"}
                    >
                      <input type="text" id="Entrevistador responsável" />
                    </InputContainer>
                  </div>
                </div>
              </section>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function InputContainer({
  title,
  children,
  htmlFor,
  width,
  lightTitle,
}: {
  title: string;
  children: ReactNode;
  htmlFor?: string;
  width?: number | string;
  lightTitle?: string;
}) {
  return (
    <div className={styles.modal__content__form__input} style={{ width }}>
      <div className={styles.label__container}>
        <label htmlFor={htmlFor || title}>{title}</label>
        {lightTitle && <span>{lightTitle}</span>}
      </div>
      {children}
    </div>
  );
}
