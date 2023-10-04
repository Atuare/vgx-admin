import { Close } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { FileInput } from "@/components/FileInput";
import { Radio } from "@/components/Radio";
import { Select } from "@/components/Select";
import useUser from "@/hooks/useUser";
import { ICandidate } from "@/interfaces/candidate.interface";
import { InterviewType } from "@/interfaces/interviews.interface";
import { dataModalSchema } from "@/schemas/dataModalSchema";
import { useGetAllTrainingsQuery } from "@/services/api/fetchApi";
import { getCandidateById } from "@/utils/candidate";
import {
  FormationTypes,
  PeriodSelect,
  StatusSelect,
  genders,
  maritalStatus,
  pixTypes,
  results,
  states,
  statesAccronym,
} from "@/utils/datamodal";
import { formatCpf } from "@/utils/formatCpf";
import { formatRG } from "@/utils/formatRg";
import { formatTimeRange } from "@/utils/formatTimeRange";
import { getBase64 } from "@/utils/getBase64";
import { formatPhoneNumber } from "@/utils/phoneFormating";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./DataModal.module.scss";
import { AccountInput } from "./components/AccountInput";
import { InputContainer } from "./components/InputContainer";

interface DataModalProps {
  children: ReactNode;
  data?: InterviewType;
}

interface AddressProps {
  zipCode: string;
  address: string;
  neighborhood: string;
  complement: string;
  state: string;
  number: string;
}

type SelectType = {
  name: string;
  id: string;
}[];

export function DataModal({ children, data }: DataModalProps) {
  const { user } = useUser();
  const { control, reset, handleSubmit } = useForm({
    resolver: yupResolver(dataModalSchema),
  });

  const [open, setOpen] = useState(false);
  const [candidate, setCandidate] = useState<ICandidate>();
  const [cities, setCities] = useState<SelectType>();
  const [pixType, setPixType] = useState<{ name: string; id: string } | null>(
    null,
  );

  const [haveDisability, setHaveDisability] = useState<boolean | null>(null);
  const [hasMedicalReport, setHasMedicalReport] = useState<boolean | null>(
    null,
  );
  const [transportVoucher, setTransportVoucher] = useState<boolean | null>(
    null,
  );
  const [address, setAddress] = useState<AddressProps>();
  const [approved, setApproved] = useState<boolean | null>(null);
  const [trainings, setTrainings] = useState<SelectType>();
  const [availabilites, setAvailabilites] = useState<SelectType>();
  const [salaryClaim, setSalaryClaim] = useState<string>(formatCurrency("0"));

  const [medicalReportPdf, setMedicalReportPdf] = useState<File>();
  const [curriculumPdf, setCurriculumPdf] = useState<File>();

  const pixRef = useRef<HTMLInputElement | null>(null);

  const { data: trainingsData, isSuccess: isTrainingsSuccess } =
    useGetAllTrainingsQuery({
      page: 1,
      size: 999999,
    });

  function handleOnSave(data: any) {
    setOpen(false);
  }

  function formatCurrency(value: string) {
    const numericValue = value.replace(/\D/g, "");

    const formattedValue = (+numericValue / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return formattedValue;
  }

  function formatCEP(cepInput: string) {
    const cepValue = cepInput?.replace(/\D/g, "");

    const formattedCepValue = cepValue
      ?.replace(/\D/g, "")
      .replace(/(\d{5})(\d{3})/, "$1-$2");

    return formattedCepValue;
  }

  function handleOnSalaryClaimChange(event: ChangeEvent<HTMLInputElement>) {
    setSalaryClaim(formatCurrency(event.target.value));
  }

  function handleOnChangePixKey(value?: string, type?: string) {
    if (!value) return;
    const numericValue = value?.replace(/\D/g, "");

    switch (pixType?.name ?? type) {
      case "CPF":
        return formatCpf(numericValue);
      case "Telefone":
        return formatPhoneNumber(numericValue);
      default:
        return value;
    }
  }

  async function getCitiesByState(id: string) {
    const cities: SelectType = [];
    axios
      .get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${id}/municipios`,
      )
      .then(({ data }) => {
        data.map((item: any) =>
          cities.push({ name: item.nome, id: item.nome }),
        );
        setCities(cities);
      });
  }

  async function getAddressByCep(cep: string) {
    const response = await axios.get(
      `https://viacep.com.br/ws/${cep.replace("-", "")}/json/`,
    );
    const data = response.data;

    setAddress(prevAddress => ({
      zipCode: data.cep,
      address: data.logradouro,
      neighborhood: data.bairro,
      complement: data.complemento,
      state: data.uf,
      number: prevAddress?.number ?? "",
    }));
  }

  function handleOnChangeCep(event: ChangeEvent<HTMLInputElement>) {
    const cep = event.target.value;
    const formattedCEP = formatCEP(cep);

    if (cep.replace("-", "").length === 8) {
      getAddressByCep(cep);
    }

    return formattedCEP;
  }

  async function getCandidateData(id: string) {
    const { data } = await getCandidateById({ id });
    setCandidate(data);
  }

  useEffect(() => {
    isTrainingsSuccess &&
      setTrainings(
        trainingsData.trainings.map((item: any) => ({
          name: item.trainingName,
          id: item.trainingName,
        })),
      );
  }, [isTrainingsSuccess]);

  useEffect(() => {
    setAvailabilites(
      data?.candidacy?.process?.availabilities.map(item => ({
        name: formatTimeRange(item),
        id: item.id,
      })),
    );
  }, []);

  useEffect(() => {
    if (data) {
      const candidateId = data?.candidacy.candidate.id;
      getCandidateData(candidateId);
    }

    if (!open) reset();
  }, [open, data]);

  useEffect(() => {
    if (candidate) {
      setAddress({
        zipCode: formatCEP(candidate?.address?.zipCode ?? ""),
        address: candidate?.address?.address,
        neighborhood: candidate?.address?.neighborhood,
        complement: candidate?.address?.complement,
        state: candidate?.address?.state,
        number: candidate?.address?.number,
      });
      setHaveDisability(candidate?.complementaryInfo?.haveDisability);
      setTransportVoucher(candidate?.complementaryInfo?.transportVoucher);
    }

    getCitiesByState(candidate?.state ?? "");

    if (candidate?.documents?.bank?.pixKey) {
      setPixType({
        id: candidate?.documents?.bank?.pixKeyType,
        name: candidate?.documents?.bank?.pixKeyType,
      });
    }

    handleOnChangePixKey(
      candidate?.documents?.bank?.pixKey,
      candidate?.documents?.bank?.pixKeyType,
    );

    reset({
      ...candidate,
      cpf: formatCpf(candidate?.cpf || ""),
      whatsapp: formatPhoneNumber(candidate?.whatsapp ?? ""),
      phone: formatPhoneNumber(candidate?.phone ?? ""),
      address: {
        ...candidate?.address,
        zipCode: formatCEP(candidate?.address?.zipCode ?? ""),
      },
    });
  }, [candidate]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <span>{children}</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <div className={styles.modal}>
          <Dialog.Overlay className={styles.modal__overlay} />
          <Dialog.Content className={styles.modal__content}>
            <form onSubmit={handleSubmit(handleOnSave)}>
              <div className={styles.modal__titleContainer}>
                <Dialog.Title className={styles.modal__title}>
                  <span>
                    {data?.candidacy.candidate.name} -{" "}
                    {data?.candidacy?.process?.role?.roleText}
                  </span>
                  <Dialog.Close asChild>
                    <span>
                      <Close />
                    </span>
                  </Dialog.Close>
                </Dialog.Title>
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
                      <Controller
                        control={control}
                        name="name"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer title="Nome" error={error?.message}>
                            <input
                              type="text"
                              id="Nome"
                              style={{ width: 272 }}
                              defaultValue={data?.candidacy?.candidate?.name}
                              onChange={e => onChange(e.target.value)}
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="cpf"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer title="CPF" error={error?.message}>
                            <input
                              type="text"
                              id="CPF"
                              defaultValue={formatCpf(candidate?.cpf ?? "")}
                              onChange={e => {
                                onChange(e.target.value);
                                e.target.value = formatCpf(e.target.value);
                              }}
                              maxLength={14}
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="gender"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Sexo"
                            width={"100%"}
                            error={error?.message}
                          >
                            <Select
                              onChange={({ id }) => onChange(id)}
                              placeholder="Selecione"
                              options={genders}
                              width="100%"
                              defaultValue={candidate?.gender}
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="civilStatus"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Estado civil"
                            width={"100%"}
                            error={error?.message}
                          >
                            <Select
                              onChange={({ id }) => onChange(id)}
                              placeholder="Selecione"
                              options={maritalStatus}
                              maxHeight={250}
                              defaultValue={candidate?.civilStatus}
                            />
                          </InputContainer>
                        )}
                      />
                    </div>

                    <div
                      className={
                        styles.modal__content__form__item__inputs__container
                      }
                    >
                      <Controller
                        control={control}
                        name="birthdate"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Data de nascimento"
                            htmlFor="birthdate"
                            error={error?.message}
                          >
                            <input
                              type="date"
                              id="birthdate"
                              defaultValue={
                                data?.candidacy?.candidate?.birthdate
                              }
                              onChange={e => {
                                onChange(e.target.value);
                              }}
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="state"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Estado"
                            htmlFor="state"
                            width={"30%"}
                            error={error?.message}
                          >
                            <Select
                              onChange={({ id }) => {
                                onChange(id);
                                getCitiesByState(id);
                              }}
                              placeholder="Selecione"
                              options={states}
                              defaultValue={
                                statesAccronym[
                                  candidate?.state as keyof typeof statesAccronym
                                ]
                              }
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="county"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Município"
                            htmlFor="city"
                            error={error?.message}
                          >
                            <Select
                              onChange={({ id }) => onChange(id)}
                              placeholder="Selecione"
                              options={cities ?? []}
                              width={200}
                              defaultValue={candidate?.county}
                            />
                          </InputContainer>
                        )}
                      />
                    </div>

                    <div
                      className={
                        styles.modal__content__form__item__inputs__container
                      }
                    >
                      <Controller
                        control={control}
                        name="whatsapp"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Whatsapp"
                            htmlFor="whatsapp"
                            error={error?.message}
                          >
                            <input
                              type="text"
                              id="whatsapp"
                              defaultValue={formatPhoneNumber(
                                candidate?.whatsapp ?? "",
                              )}
                              onChange={e => {
                                onChange(e.target.value);
                                e.target.value = formatPhoneNumber(
                                  e.target.value,
                                );
                              }}
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="phone"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Telefone"
                            htmlFor="phone"
                            error={error?.message}
                          >
                            <input
                              type="text"
                              id="phone"
                              defaultValue={formatPhoneNumber(
                                candidate?.phone ?? "",
                              )}
                              onChange={e => {
                                onChange(e.target.value);
                                e.target.value = formatPhoneNumber(
                                  e.target.value,
                                );
                              }}
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="email"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="E-mail"
                            htmlFor="email"
                            width={272}
                            error={error?.message}
                          >
                            <input
                              type="email"
                              id="email"
                              defaultValue={data?.candidacy?.candidate?.email}
                              onChange={e => onChange(e.target.value)}
                            />
                          </InputContainer>
                        )}
                      />
                    </div>

                    <div
                      className={
                        styles.modal__content__form__item__inputs__container
                      }
                    >
                      <Controller
                        control={control}
                        name="motherName"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Nome completo da mãe"
                            htmlFor="motherName"
                            error={error?.message}
                          >
                            <input
                              type="text"
                              style={{ width: 272 }}
                              id="motherName"
                              defaultValue={
                                data?.candidacy?.candidate?.motherName
                              }
                              onChange={e => onChange(e.target.value)}
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="fatherName"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Nome completo do pai"
                            htmlFor="fatherName"
                            error={error?.message}
                          >
                            <input
                              type="text"
                              style={{ width: 272 }}
                              id="fatherName"
                              defaultValue={
                                data?.candidacy?.candidate?.fatherName
                              }
                              onChange={e => onChange(e.target.value)}
                            />
                          </InputContainer>
                        )}
                      />
                    </div>

                    <div
                      className={
                        styles.modal__content__form__item__inputs__container
                      }
                    >
                      <Controller
                        control={control}
                        name="childUnderfourteen"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Possui filhos menores de 14 anos?"
                            error={error?.message}
                          >
                            <Radio
                              column
                              lightTheme
                              defaultValue={
                                data?.candidacy?.candidate?.childUnderfourteen
                              }
                              onChange={onChange}
                            />
                          </InputContainer>
                        )}
                      />
                      <Controller
                        control={control}
                        name="childCount"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Número de filhos"
                            error={error?.message}
                          >
                            <input
                              type="number"
                              style={{ width: 80 }}
                              min={0}
                              defaultValue={
                                data?.candidacy?.candidate?.childCount
                              }
                              onChange={e => {
                                if (!e.target.validity.valid) {
                                  e.target.value = "";
                                  return;
                                }
                                onChange(e.target.value);
                              }}
                            />
                          </InputContainer>
                        )}
                      />
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
                      <Controller
                        control={control}
                        name="address.zipCode"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer title="CEP" error={error?.message}>
                            <input
                              type="text"
                              id="CEP"
                              defaultValue={address?.zipCode}
                              onChange={e => {
                                e.target.value = handleOnChangeCep(e);
                                onChange(e.target.value);
                              }}
                              maxLength={9}
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="address.address"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Endereço"
                            error={error?.message}
                          >
                            <input
                              type="text"
                              id="Endereço"
                              defaultValue={address?.address}
                              onChange={e => onChange(e.target.value)}
                            />
                          </InputContainer>
                        )}
                      />

                      <InputContainer title="Logradouro">
                        <input type="text" id="Logradouro" />
                      </InputContainer>

                      <Controller
                        control={control}
                        name="address.neighborhood"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer title="Bairro" error={error?.message}>
                            <input
                              type="text"
                              id="Bairro"
                              defaultValue={address?.neighborhood}
                              onChange={e => onChange(e.target.value)}
                            />
                          </InputContainer>
                        )}
                      />
                    </div>

                    <div
                      className={
                        styles.modal__content__form__item__inputs__container
                      }
                    >
                      <Controller
                        control={control}
                        name="address.number"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer title="Número" error={error?.message}>
                            <input
                              type="number"
                              id="Número"
                              defaultValue={address?.number}
                              onChange={e => onChange(e.target.value)}
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="address.complement"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Complemento"
                            error={error?.message}
                          >
                            <input
                              type="text"
                              id="Complemento"
                              defaultValue={address?.complement}
                              onChange={e => onChange(e.target.value)}
                            />
                          </InputContainer>
                        )}
                      />
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
                      <Controller
                        control={control}
                        name="documents.identity.rg"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer title="RG" error={error?.message}>
                            <input
                              type="text"
                              id="RG"
                              defaultValue={candidate?.documents?.identity?.rg}
                              onChange={e => {
                                if (!e.target.validity.valid) {
                                  e.target.value = "";
                                  return;
                                }
                                onChange(e.target.value);
                                e.target.value = formatRG(e.target.value);
                              }}
                              maxLength={9}
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="documents.identity.identityShippingDate"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Data de expedição"
                            htmlFor="expeditionDate"
                            error={error?.message}
                          >
                            <input
                              type="date"
                              id="expeditionDate"
                              defaultValue={
                                candidate?.documents?.identity
                                  ?.identityShippingDate
                              }
                              onChange={e => {
                                onChange(e.target.value);
                              }}
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="documents.identity.federalUnit"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Órgão expedidor"
                            error={error?.message}
                          >
                            <input
                              type="text"
                              id="Órgão expedidor"
                              defaultValue={
                                candidate?.documents?.identity?.federalUnit
                              }
                              onChange={e => {
                                onChange(e.target.value);
                              }}
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="documents.identity.uf"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="UF"
                            width={"30%"}
                            error={error?.message}
                          >
                            <Select
                              onChange={({ id }) => onChange(id)}
                              placeholder="Selecione"
                              options={states}
                              defaultValue={
                                statesAccronym[
                                  candidate?.documents?.identity?.uf?.toUpperCase() as keyof typeof statesAccronym
                                ]
                              }
                            />
                          </InputContainer>
                        )}
                      />
                    </div>

                    <div
                      className={
                        styles.modal__content__form__item__inputs__container
                      }
                    >
                      <Controller
                        control={control}
                        name="documents.work.pis"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Número do PIS"
                            error={error?.message}
                          >
                            <input
                              type="text"
                              id="Número do PIS"
                              defaultValue={candidate?.documents?.work?.pis}
                              maxLength={11}
                              pattern="\d*"
                              onChange={e => {
                                if (!e.target.validity.valid) {
                                  e.target.value = "";
                                  return;
                                }
                                onChange(e.target.value);
                              }}
                            />
                          </InputContainer>
                        )}
                      />
                    </div>

                    <h1 style={{ fontSize: 17 }}>CTPS</h1>

                    <div
                      className={
                        styles.modal__content__form__item__inputs__container
                      }
                    >
                      <Controller
                        control={control}
                        name="documents.work.ctps"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Número da CTPS"
                            error={error?.message}
                          >
                            <input
                              type="text"
                              id="Número da CTPS"
                              defaultValue={candidate?.documents?.work?.ctps}
                              pattern="[0-9\/]*"
                              maxLength={11}
                              onChange={e => {
                                if (!e.target.validity.valid) {
                                  e.target.value = "";
                                  return;
                                }
                                onChange(e.target.value);
                              }}
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="documents.work.shippingDate"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Data de expedição"
                            htmlFor="expeditionDateWork"
                            error={error?.message}
                          >
                            <input
                              type="date"
                              id="expeditionDateWork"
                              defaultValue={
                                candidate?.documents?.work?.shippingDate
                              }
                              onChange={e => {
                                onChange(e.target.value);
                              }}
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="documents.work.serie"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer title="Série" error={error?.message}>
                            <input
                              type="text"
                              id="Série"
                              defaultValue={candidate?.documents?.work?.serie}
                              onChange={e => onChange(e.target.value)}
                            />
                          </InputContainer>
                        )}
                      />
                    </div>

                    <div
                      className={
                        styles.modal__content__form__item__inputs__container
                      }
                    >
                      <Controller
                        control={control}
                        name="documents.work.uf"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="UF"
                            width={"30%"}
                            error={error?.message}
                          >
                            <Select
                              onChange={({ id }) => onChange(id)}
                              placeholder="Selecione"
                              options={states}
                              defaultValue={
                                statesAccronym[
                                  candidate?.documents?.work?.uf?.toUpperCase() as keyof typeof statesAccronym
                                ]
                              }
                            />
                          </InputContainer>
                        )}
                      />
                    </div>

                    <h1 style={{ fontSize: 17 }}>Conta corrente</h1>

                    <div
                      className={
                        styles.modal__content__form__item__inputs__container
                      }
                    >
                      <Controller
                        control={control}
                        name="documents.bank.bank"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer title="Banco" error={error?.message}>
                            <input
                              type="text"
                              id="Banco"
                              defaultValue={candidate?.documents?.bank?.bank}
                              onChange={e => onChange(e.target.value)}
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="documents.bank.agency"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Agência"
                            error={error?.message}
                          >
                            <input
                              type="text"
                              id="Agência"
                              value={candidate?.documents?.bank?.agency}
                              maxLength={4}
                              pattern="\d*"
                              onChange={e => {
                                if (!e.target.validity.valid) {
                                  e.target.value = "";
                                  return;
                                }
                                onChange(e.target.value);
                              }}
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="documents.bank.account"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer title="Conta" error={error?.message}>
                            <AccountInput
                              defaultValue={
                                candidate?.documents?.bank?.account ?? ""
                              }
                              onChange={onChange}
                            />
                          </InputContainer>
                        )}
                      />
                    </div>

                    <div
                      className={
                        styles.modal__content__form__item__inputs__container
                      }
                    >
                      <Controller
                        control={control}
                        name="documents.bank.pixKeyType"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Tipo chave PIX"
                            width={"20%"}
                            error={error?.message}
                          >
                            <Select
                              onChange={value => {
                                if (!value) return;
                                if (value?.id === pixType?.id) return;
                                setPixType(value);
                                if (pixRef && pixRef.current) {
                                  const nativeInputValueSetter =
                                    Object.getOwnPropertyDescriptor(
                                      window.HTMLInputElement.prototype,
                                      "value",
                                    )?.set;
                                  nativeInputValueSetter?.call(
                                    pixRef.current,
                                    "",
                                  );

                                  const ev2 = new Event("input", {
                                    bubbles: true,
                                  });
                                  pixRef.current.dispatchEvent(ev2);
                                }
                                onChange(value.id);
                              }}
                              options={pixTypes}
                              placeholder="Selecione"
                              maxHeight={250}
                              defaultValue={
                                candidate?.documents?.bank?.pixKeyType
                              }
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="documents.bank.pixKey"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Chave PIX"
                            error={error?.message}
                          >
                            <input
                              type={pixType?.id === "E-mail" ? "email" : "text"}
                              maxLength={
                                pixType?.id === "Chave aleatória"
                                  ? 32
                                  : undefined
                              }
                              id="Chave PIX"
                              defaultValue={handleOnChangePixKey(
                                candidate?.documents?.bank?.pixKey ?? "",
                              )}
                              disabled={!pixType?.id}
                              onChange={e => {
                                const newValue = handleOnChangePixKey(
                                  e.target.value,
                                );
                                if (newValue) {
                                  e.target.value = newValue;
                                }

                                onChange(e.target.value);
                              }}
                              style={{
                                cursor: !pixType ? "not-allowed" : "text",
                              }}
                              ref={pixRef}
                            />
                          </InputContainer>
                        )}
                      />
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
                      <Controller
                        control={control}
                        name="complementaryInfo.hasCellPhone"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Possui celular?"
                            error={error?.message}
                          >
                            <Radio
                              column
                              lightTheme
                              defaultValue={
                                candidate?.complementaryInfo?.hasCellPhone
                              }
                              onChange={onChange}
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="complementaryInfo.hasCellPc"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Possui computador?"
                            error={error?.message}
                          >
                            <Radio
                              column
                              lightTheme
                              defaultValue={
                                candidate?.complementaryInfo?.hasCellPc
                              }
                              onChange={onChange}
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="complementaryInfo.hasInternet"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Possui internet?"
                            error={error?.message}
                          >
                            <Radio
                              column
                              lightTheme
                              defaultValue={
                                candidate?.complementaryInfo?.hasInternet
                              }
                              onChange={onChange}
                            />
                          </InputContainer>
                        )}
                      />
                    </div>

                    <div
                      className={
                        styles.modal__content__form__item__inputs__container
                      }
                    >
                      <Controller
                        control={control}
                        name="complementaryInfo.weekendObjection"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Possui objeção em trabalhar algum dia da semana?"
                            error={error?.message}
                          >
                            <Radio
                              column
                              lightTheme
                              defaultValue={
                                candidate?.complementaryInfo?.weekendObjection
                              }
                              onChange={onChange}
                            />
                          </InputContainer>
                        )}
                      />
                    </div>

                    {data?.candidacy?.process?.requestCv && (
                      <div
                        className={
                          styles.modal__content__form__item__inputs__container
                        }
                      >
                        <InputContainer title="Pretensão salarial">
                          <input
                            type="text"
                            id="Pretensão salarial"
                            onChange={handleOnSalaryClaimChange}
                            value={salaryClaim}
                          />
                        </InputContainer>
                      </div>
                    )}

                    <div
                      className={
                        styles.modal__content__form__item__inputs__container
                      }
                    >
                      <Controller
                        control={control}
                        name="complementaryInfo.haveDisability"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Possui alguma deficiência?"
                            error={error?.message}
                          >
                            <Radio
                              column
                              lightTheme
                              onChange={val => {
                                onChange(val);
                                setHaveDisability(val);
                              }}
                              defaultValue={
                                candidate?.complementaryInfo?.haveDisability
                              }
                            />
                          </InputContainer>
                        )}
                      />

                      {haveDisability && (
                        <Controller
                          control={control}
                          name="complementaryInfo.disabilityDescription"
                          render={({
                            field: { onChange },
                            fieldState: { error },
                          }) => (
                            <InputContainer
                              title="Qual?"
                              error={error?.message}
                            >
                              <input
                                type="text"
                                id="Qual?"
                                defaultValue={
                                  candidate?.complementaryInfo
                                    ?.disabilityDescription
                                }
                                onChange={e => onChange(e.target.value)}
                              />
                            </InputContainer>
                          )}
                        />
                      )}
                    </div>

                    <div
                      className={
                        styles.modal__content__form__item__inputs__container
                      }
                    >
                      <Controller
                        control={control}
                        name="complementaryInfo.hasMedicalReport"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Possui laudo médico?"
                            error={error?.message}
                          >
                            <Radio
                              column
                              lightTheme
                              onChange={val => {
                                onChange(val);
                                setHasMedicalReport(val);
                              }}
                              defaultValue={
                                candidate?.complementaryInfo?.hasMedicalReport
                              }
                            />
                          </InputContainer>
                        )}
                      />

                      {hasMedicalReport && (
                        <Controller
                          control={control}
                          name="complementaryInfo.medicalReport"
                          render={({
                            field: { onChange },
                            fieldState: { error },
                          }) => (
                            <InputContainer
                              title="Anexar arquivo"
                              error={error?.message}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: 8,
                                }}
                              >
                                <FileInput
                                  onChange={async file => {
                                    setMedicalReportPdf(file);
                                    const medicalReportBase64 =
                                      await getBase64(file);
                                    onChange(medicalReportBase64);
                                  }}
                                  maxSize={5}
                                  allowedTypes={["pdf"]}
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
                        />
                      )}
                    </div>

                    <div
                      className={
                        styles.modal__content__form__item__inputs__container
                      }
                    >
                      <Controller
                        control={control}
                        name="complementaryInfo.transportVoucher"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Opta por receber vale transporte?"
                            lightTitle="(vagas presenciais)"
                            error={error?.message}
                          >
                            <Radio
                              column
                              lightTheme
                              onChange={val => {
                                onChange(val);
                                setTransportVoucher(val);
                              }}
                              defaultValue={
                                candidate?.complementaryInfo?.transportVoucher
                              }
                            />
                          </InputContainer>
                        )}
                      />
                    </div>

                    {transportVoucher && (
                      <>
                        <div
                          className={
                            styles.modal__content__form__item__inputs__container
                          }
                        >
                          <Controller
                            control={control}
                            name="complementaryInfo.transportCompany"
                            render={({
                              field: { onChange },
                              fieldState: { error },
                            }) => (
                              <InputContainer
                                title="Empresa"
                                error={error?.message}
                              >
                                <input
                                  type="text"
                                  id="Empresa"
                                  defaultValue={
                                    candidate?.complementaryInfo
                                      ?.transportCompany
                                  }
                                  onChange={e => onChange(e.target.value)}
                                />
                              </InputContainer>
                            )}
                          />

                          <Controller
                            control={control}
                            name="complementaryInfo.transportLine"
                            render={({
                              field: { onChange },
                              fieldState: { error },
                            }) => (
                              <InputContainer
                                title="Linha"
                                error={error?.message}
                              >
                                <input
                                  type="text"
                                  id="Linha"
                                  defaultValue={
                                    candidate?.complementaryInfo?.transportLine
                                  }
                                  onChange={e => onChange(e.target.value)}
                                />
                              </InputContainer>
                            )}
                          />
                        </div>

                        <div
                          className={
                            styles.modal__content__form__item__inputs__container
                          }
                        >
                          <Controller
                            control={control}
                            name="complementaryInfo.transportTaxGoing"
                            render={({
                              field: { onChange },
                              fieldState: { error },
                            }) => (
                              <InputContainer
                                title="Tarifa de ida"
                                error={error?.message}
                              >
                                <input
                                  type="text"
                                  id="Tarifa de ida"
                                  defaultValue={formatCurrency(
                                    candidate?.complementaryInfo
                                      ?.transportTaxGoing ?? "",
                                  )}
                                  onChange={e => {
                                    e.target.value = formatCurrency(
                                      e.target.value,
                                    );
                                    onChange(e.target.value);
                                  }}
                                />
                              </InputContainer>
                            )}
                          />

                          <Controller
                            control={control}
                            name="complementaryInfo.transportTaxReturn"
                            render={({
                              field: { onChange },
                              fieldState: { error },
                            }) => (
                              <InputContainer
                                title="Tarifa de volta"
                                error={error?.message}
                              >
                                <input
                                  type="text"
                                  id="Tarifa de volta"
                                  defaultValue={formatCurrency(
                                    candidate?.complementaryInfo
                                      ?.transportTaxReturn ?? "",
                                  )}
                                  onChange={e => {
                                    e.target.value = formatCurrency(
                                      e.target.value,
                                    );
                                    onChange(e.target.value);
                                  }}
                                />
                              </InputContainer>
                            )}
                          />

                          <Controller
                            control={control}
                            name="complementaryInfo.transportTaxDaily"
                            render={({
                              field: { onChange },
                              fieldState: { error },
                            }) => (
                              <InputContainer
                                title="Tarifa diária"
                                error={error?.message}
                              >
                                <input
                                  type="text"
                                  id="Tarifa diária"
                                  value={formatCurrency(
                                    candidate?.complementaryInfo
                                      ?.transportTaxDaily ?? "",
                                  )}
                                  onChange={e => {
                                    e.target.value = formatCurrency(
                                      e.target.value,
                                    );
                                    onChange(e.target.value);
                                  }}
                                />
                              </InputContainer>
                            )}
                          />
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
                      <Controller
                        control={control}
                        name="availability"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Disponibilidade"
                            width={"45%"}
                            error={error?.message}
                          >
                            <Select
                              onChange={({ id }) => onChange(id)}
                              placeholder="Selecione"
                              options={availabilites ?? []}
                            />
                          </InputContainer>
                        )}
                      />
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
                      <Controller
                        control={control}
                        name="formation.type"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Escolaridade"
                            width={"30%"}
                            error={error?.message}
                          >
                            <Select
                              onChange={({ id }) => onChange(id)}
                              placeholder="Selecione"
                              options={FormationTypes}
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="formation.course"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer title="Curso" error={error?.message}>
                            <input
                              type="text"
                              id="Curso"
                              onChange={e => onChange(e.target.value)}
                            />
                          </InputContainer>
                        )}
                      />

                      <Controller
                        control={control}
                        name="formation.status"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Status"
                            width={"20%"}
                            error={error?.message}
                          >
                            <Select
                              onChange={({ id }) => onChange(id)}
                              options={StatusSelect}
                              placeholder="Selecione"
                            />
                          </InputContainer>
                        )}
                      />
                    </div>
                    <div
                      className={
                        styles.modal__content__form__item__inputs__container
                      }
                    >
                      <Controller
                        control={control}
                        name="formation.period"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Período"
                            error={error?.message}
                          >
                            <Select
                              onChange={({ id }) => onChange(id)}
                              options={PeriodSelect}
                              placeholder="Selecione"
                            />
                          </InputContainer>
                        )}
                      />
                    </div>

                    {data?.candidacy?.process?.requestCv && (
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
                              onChange={file => setCurriculumPdf(file)}
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
                    <div
                      className={
                        styles.modal__content__form__item__inputs__container
                      }
                    >
                      <Controller
                        control={control}
                        name="results.result"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Resultado"
                            error={error?.message}
                          >
                            <Select
                              onChange={({ name, id }) => {
                                setApproved(name === "Aprovado");
                                onChange(id);
                              }}
                              options={results}
                              placeholder="Selecione"
                            />
                          </InputContainer>
                        )}
                      />

                      {approved && (
                        <Controller
                          control={control}
                          name="results.training"
                          render={({
                            field: { onChange },
                            fieldState: { error },
                          }) => (
                            <InputContainer
                              title="Treinamento"
                              width={"30%"}
                              error={error?.message}
                            >
                              <Select
                                onChange={({ id }) => onChange(id)}
                                placeholder="Selecione"
                                options={trainings ?? []}
                              />
                            </InputContainer>
                          )}
                        />
                      )}

                      {approved === false && (
                        <Controller
                          control={control}
                          name="results.reason"
                          render={({
                            field: { onChange },
                            fieldState: { error },
                          }) => (
                            <InputContainer
                              title="Motivo"
                              error={error?.message}
                            >
                              <input
                                type="text"
                                id="Motivo"
                                onChange={e => onChange(e.target.value)}
                              />
                            </InputContainer>
                          )}
                        />
                      )}
                    </div>
                    <div
                      className={
                        styles.modal__content__form__item__inputs__container
                      }
                    >
                      <Controller
                        control={control}
                        name="results.observation"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer
                            title="Observação"
                            width={"100%"}
                            error={error?.message}
                          >
                            <input
                              type="text"
                              id="Observação"
                              onChange={e => onChange(e.target.value)}
                            />
                          </InputContainer>
                        )}
                      />
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
                        <input
                          type="text"
                          id="Entrevistador responsável"
                          disabled
                          defaultValue={user?.employee.name}
                        />
                      </InputContainer>
                    </div>
                  </div>
                </section>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "flex-end",
                  padding: 10,
                  marginTop: 24,
                }}
              >
                <Dialog.Close asChild>
                  <span>
                    <Button text="Cancelar" buttonType="default" />
                  </span>
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
