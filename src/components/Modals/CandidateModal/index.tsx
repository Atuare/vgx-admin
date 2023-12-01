import { Close } from "@/assets/Icons";
import { FileInput } from "@/components/FileInput";
import { Radio } from "@/components/Radio";
import { CandidacyType } from "@/interfaces/candidacy.interface";
import { convertBase64ToFile } from "@/utils/base64ToFile";
import { statesAccronym } from "@/utils/datamodal";
import { formatCEP } from "@/utils/formatCep";
import { formatCpf } from "@/utils/formatCpf";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatRG } from "@/utils/formatRg";
import { formatTimeRange } from "@/utils/formatTimeRange";
import { formatPhoneNumber } from "@/utils/phoneFormating";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode, useEffect, useState } from "react";
import styles from "../DataModal/DataModal.module.scss";
import { AccountInput } from "../DataModal/components/AccountInput";
import { InputContainer } from "../DataModal/components/InputContainer";
import { ModalStatus } from "./components/ModalStatus";

interface CandidateModalProps {
  children: ReactNode;
  data: CandidacyType;
}

export function CandidateModal({ children, data }: CandidateModalProps) {
  const [open, setOpen] = useState(false);

  const { candidate, process, availability } = data;

  const [medicalReportPdf, setMedicalReportPdf] = useState<File>();
  const [curriculumPdf, setCurriculumPdf] = useState<File>();

  function handleOnChangePixKey(value?: string, type?: string) {
    if (!value && !type) return;
    const numericValue = value?.replace(/\D/g, "");
    if (!numericValue) return;

    switch (type) {
      case "CPF":
        return formatCpf(numericValue);
      case "Telefone":
        return formatPhoneNumber(numericValue);
      default:
        return value;
    }
  }

  const getCandidateDocuments = async () => {
    if (candidate?.complementaryInfo?.medicalReport) {
      setMedicalReportPdf(
        await convertBase64ToFile(
          candidate?.complementaryInfo?.medicalReport ?? "",
          candidate.name + "_laudo_medico",
        ),
      );
    }

    if (candidate?.curriculum) {
      setCurriculumPdf(
        await convertBase64ToFile(
          candidate?.curriculum ?? "",
          candidate.name + "_curriculo",
        ),
      );
    }
  };

  useEffect(() => {
    getCandidateDocuments();
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <span>{children}</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <div className={styles.modal}>
          <Dialog.Overlay className={styles.modal__overlay} />
          <Dialog.Content className={styles.modal__content}>
            <div className={styles.modal__titleContainer}>
              <Dialog.Title className={styles.modal__title}>
                {candidate?.name} - {process.role.roleText}
                <Dialog.Close asChild>
                  <span>
                    <Close />
                  </span>
                </Dialog.Close>
              </Dialog.Title>
              <ModalStatus data={data} />
            </div>

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
                      <input
                        type="text"
                        id="Nome"
                        style={{ width: 272 }}
                        defaultValue={candidate?.name}
                        disabled
                      />
                    </InputContainer>

                    <InputContainer title="CPF">
                      <input
                        type="text"
                        id="CPF"
                        defaultValue={formatCpf(candidate?.cpf ?? "")}
                        disabled
                      />
                    </InputContainer>

                    <InputContainer title="Sexo" width={"100%"}>
                      <input
                        type="text"
                        style={{ width: "100%" }}
                        defaultValue={candidate?.gender}
                        disabled
                      />
                    </InputContainer>

                    <InputContainer title="Estado civil" width={"100%"}>
                      <input
                        type="text"
                        defaultValue={candidate?.civilStatus}
                        disabled
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
                      <input
                        type="date"
                        id="birthdate"
                        defaultValue={candidate?.birthdate}
                        disabled
                      />
                    </InputContainer>

                    <InputContainer
                      title="Estado"
                      htmlFor="state"
                      width={"30%"}
                    >
                      <input
                        disabled
                        type="text"
                        defaultValue={
                          statesAccronym[
                            candidate?.state as keyof typeof statesAccronym
                          ]
                        }
                      />
                    </InputContainer>

                    <InputContainer title="Município" htmlFor="city">
                      <input
                        disabled
                        style={{ width: "200px" }}
                        defaultValue={candidate?.county}
                      />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Whatsapp" htmlFor="whatsapp">
                      <input
                        type="text"
                        id="whatsapp"
                        defaultValue={formatPhoneNumber(
                          candidate?.whatsapp ?? "",
                        )}
                        disabled
                      />
                    </InputContainer>

                    <InputContainer title="Telefone" htmlFor="phone">
                      <input
                        type="text"
                        id="phone"
                        defaultValue={formatPhoneNumber(candidate?.phone ?? "")}
                        disabled
                      />
                    </InputContainer>

                    <InputContainer title="E-mail" htmlFor="email" width={272}>
                      <input
                        type="email"
                        id="email"
                        defaultValue={candidate?.email}
                        disabled
                      />
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
                        defaultValue={candidate?.motherName}
                        disabled
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
                        defaultValue={candidate?.fatherName}
                        disabled
                      />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Possui filhos menores de 14 anos?">
                      <Radio
                        column
                        lightTheme
                        defaultValue={candidate?.childUnderfourteen}
                        disabled
                      />
                    </InputContainer>

                    <InputContainer title="Número de filhos">
                      <input
                        type="number"
                        style={{ width: 80 }}
                        defaultValue={candidate?.childCount}
                        disabled
                      />
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
                      <input
                        type="text"
                        id="CEP"
                        defaultValue={formatCEP(candidate?.address?.zipCode)}
                        disabled
                      />
                    </InputContainer>

                    <InputContainer title="Endereço">
                      <input
                        type="text"
                        id="Endereço"
                        defaultValue={candidate?.address?.address}
                        disabled
                      />
                    </InputContainer>

                    <InputContainer title="Logradouro">
                      <input type="text" id="Logradouro" disabled />
                    </InputContainer>

                    <InputContainer title="Bairro">
                      <input
                        type="text"
                        id="Bairro"
                        defaultValue={candidate?.address?.neighborhood}
                        disabled
                      />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Número">
                      <input
                        type="number"
                        id="Número"
                        defaultValue={candidate?.address?.number}
                        disabled
                      />
                    </InputContainer>

                    <InputContainer title="Complemento">
                      <input
                        type="text"
                        id="Complemento"
                        defaultValue={candidate?.address?.complement}
                        disabled
                      />
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
                      <input
                        type="text"
                        id="RG"
                        defaultValue={formatRG(
                          candidate?.documents?.identity?.rg ?? "",
                        )}
                        disabled
                      />
                    </InputContainer>

                    <InputContainer
                      title="Data de expedição"
                      htmlFor="expeditionDate"
                    >
                      <input
                        type="date"
                        id="expeditionDate"
                        defaultValue={
                          candidate?.documents?.identity?.identityShippingDate
                        }
                        disabled
                      />
                    </InputContainer>

                    <InputContainer title="Órgão expedidor">
                      <input
                        type="text"
                        id="Órgão expedidor"
                        defaultValue={
                          candidate?.documents?.identity?.federalUnit
                        }
                        disabled
                      />
                    </InputContainer>

                    <InputContainer title="UF" width={"30%"}>
                      <input
                        type="text"
                        disabled
                        defaultValue={
                          statesAccronym[
                            candidate?.documents?.identity?.uf?.toUpperCase() as keyof typeof statesAccronym
                          ]
                        }
                      />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Número do PIS">
                      <input
                        type="text"
                        id="Número do PIS"
                        defaultValue={candidate?.documents?.work?.pis}
                        disabled
                      />
                    </InputContainer>
                  </div>

                  <h1 style={{ fontSize: 17 }}>CTPS</h1>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Número da CTPS">
                      <input
                        type="text"
                        id="Número da CTPS"
                        defaultValue={candidate?.documents?.work?.ctps}
                        disabled
                      />
                    </InputContainer>

                    <InputContainer
                      title="Data de expedição"
                      htmlFor="expeditionDateWork"
                    >
                      <input
                        type="date"
                        id="expeditionDateWork"
                        defaultValue={candidate?.documents?.work?.shippingDate}
                        disabled
                      />
                    </InputContainer>

                    <InputContainer title="Série">
                      <input
                        type="text"
                        id="Série"
                        defaultValue={candidate?.documents?.work?.serie}
                        disabled
                      />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="UF" width={"30%"}>
                      <input
                        type="text"
                        disabled
                        defaultValue={
                          statesAccronym[
                            candidate?.documents?.work?.uf?.toUpperCase() as keyof typeof statesAccronym
                          ]
                        }
                      />
                    </InputContainer>
                  </div>

                  <h1 style={{ fontSize: 17 }}>Conta corrente</h1>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Banco">
                      <input
                        type="text"
                        id="Banco"
                        defaultValue={candidate?.documents?.bank?.bank}
                        disabled
                      />
                    </InputContainer>

                    <InputContainer title="Agência">
                      <input
                        type="text"
                        id="Agência"
                        value={candidate?.documents?.bank?.agency}
                        disabled
                      />
                    </InputContainer>

                    <InputContainer title="Conta">
                      <AccountInput
                        defaultValue={candidate?.documents?.bank?.account ?? ""}
                        disabled
                      />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Tipo chave PIX" width={"20%"}>
                      <input
                        disabled
                        type="text"
                        defaultValue={candidate?.documents?.bank?.pixKeyType}
                      />
                    </InputContainer>

                    <InputContainer title="Chave PIX">
                      <input
                        id="Chave PIX"
                        defaultValue={handleOnChangePixKey(
                          candidate?.documents?.bank?.pixKey ?? "",
                          candidate?.documents?.bank?.pixKeyType ?? "",
                        )}
                        disabled
                      />
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
                      <Radio
                        column
                        lightTheme
                        defaultValue={
                          candidate?.complementaryInfo?.hasCellPhone
                        }
                        disabled
                      />
                    </InputContainer>

                    <InputContainer title="Possui computador?">
                      <Radio
                        column
                        lightTheme
                        defaultValue={candidate?.complementaryInfo?.hasCellPc}
                        disabled
                      />
                    </InputContainer>

                    <InputContainer title="Possui internet?">
                      <Radio
                        column
                        lightTheme
                        defaultValue={candidate?.complementaryInfo?.hasInternet}
                        disabled
                      />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Possui objeção em trabalhar algum dia da semana?">
                      <Radio
                        column
                        lightTheme
                        defaultValue={
                          candidate?.complementaryInfo?.weekendObjection
                        }
                        disabled
                      />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Possui alguma deficiência?">
                      <Radio
                        column
                        lightTheme
                        disabled
                        defaultValue={
                          candidate?.complementaryInfo?.haveDisability
                        }
                      />
                    </InputContainer>

                    {candidate?.complementaryInfo?.haveDisability && (
                      <InputContainer title="Qual?">
                        <input
                          type="text"
                          id="Qual?"
                          defaultValue={
                            candidate?.complementaryInfo?.disabilityDescription
                          }
                          disabled
                        />
                      </InputContainer>
                    )}
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Possui laudo médico?">
                      <Radio
                        column
                        lightTheme
                        disabled
                        defaultValue={
                          candidate?.complementaryInfo?.hasMedicalReport
                        }
                      />
                    </InputContainer>

                    {candidate?.complementaryInfo?.hasMedicalReport && (
                      <InputContainer title="Anexar arquivo">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 8,
                          }}
                        >
                          <FileInput
                            maxSize={5}
                            allowedTypes={["pdf"]}
                            disabled
                            defaultFile={medicalReportPdf}
                          />
                          <a
                            href={
                              medicalReportPdf &&
                              URL.createObjectURL(medicalReportPdf)
                            }
                            target="_blank"
                            style={{
                              alignSelf: "flex-end",
                              cursor: "pointer",
                            }}
                          >
                            Visualizar documento
                          </a>
                        </div>
                      </InputContainer>
                    )}
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
                      <Radio
                        column
                        lightTheme
                        disabled
                        defaultValue={
                          candidate?.complementaryInfo?.transportVoucher
                        }
                      />
                    </InputContainer>
                  </div>

                  {candidate?.complementaryInfo?.transportVoucher && (
                    <>
                      <div
                        className={
                          styles.modal__content__form__item__inputs__container
                        }
                      >
                        <InputContainer title="Empresa">
                          <input
                            type="text"
                            id="Empresa"
                            defaultValue={
                              candidate?.complementaryInfo?.transportCompany
                            }
                            disabled
                          />
                        </InputContainer>

                        <InputContainer title="Linha">
                          <input
                            type="text"
                            id="Linha"
                            defaultValue={
                              candidate?.complementaryInfo?.transportLine
                            }
                            disabled
                          />
                        </InputContainer>
                      </div>

                      <div
                        className={
                          styles.modal__content__form__item__inputs__container
                        }
                      >
                        <InputContainer title="Tarifa de ida">
                          <input
                            type="text"
                            id="Tarifa de ida"
                            defaultValue={formatCurrency(
                              candidate?.complementaryInfo?.transportTaxGoing ??
                                "",
                            )}
                            disabled
                          />
                        </InputContainer>

                        <InputContainer title="Tarifa de volta">
                          <input
                            type="text"
                            id="Tarifa de volta"
                            defaultValue={formatCurrency(
                              candidate?.complementaryInfo
                                ?.transportTaxReturn ?? "",
                            )}
                            disabled
                          />
                        </InputContainer>

                        <InputContainer title="Tarifa diária">
                          <input
                            type="text"
                            id="Tarifa diária"
                            value={formatCurrency(
                              candidate?.complementaryInfo?.transportTaxDaily ??
                                "",
                            )}
                            disabled
                          />
                        </InputContainer>
                      </div>
                    </>
                  )}
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
                    <InputContainer title="Disponibilidade" width={"45%"}>
                      <input
                        type="text"
                        disabled
                        defaultValue={formatTimeRange(availability ?? "")}
                      />
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
                    <InputContainer title="Escolaridade" width={"30%"}>
                      <input
                        type="text"
                        disabled
                        defaultValue={candidate?.formations?.type}
                      />
                    </InputContainer>

                    <InputContainer title="Curso">
                      <input
                        type="text"
                        id="Curso"
                        disabled
                        defaultValue={candidate?.formations?.course}
                      />
                    </InputContainer>

                    <InputContainer title="Status" width={"20%"}>
                      <input
                        disabled
                        type="text"
                        defaultValue={candidate?.formations?.status}
                      />
                    </InputContainer>
                  </div>
                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Período" width={"20%"}>
                      <input
                        type="text"
                        disabled
                        defaultValue={candidate?.formations?.period}
                      />
                    </InputContainer>
                  </div>

                  {candidate?.curriculum && (
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
                          <FileInput
                            defaultFile={curriculumPdf}
                            maxSize={5}
                            allowedTypes={["pdf"]}
                          />
                          <a
                            href={
                              curriculumPdf &&
                              URL.createObjectURL(curriculumPdf)
                            }
                            target="_blank"
                            style={{
                              alignSelf: "flex-end",
                              cursor: "pointer",
                            }}
                          >
                            Visualizar documento
                          </a>
                        </div>
                      </InputContainer>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
