import { Close } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { FileInput } from "@/components/FileInput";
import { Radio } from "@/components/Radio";
import { Select } from "@/components/Select";
import useUser from "@/hooks/useUser";
import { ICandidate } from "@/interfaces/candidate.interface";
import { InterviewType } from "@/interfaces/interviews.interface";
import { dataModalSchema } from "@/schemas/dataModalSchema";
import {
  useGetAllSchoolingsQuery,
  useGetAllTrainingsQuery,
} from "@/services/api/fetchApi";
import { getCandidateById } from "@/utils/candidate";
import {
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
import { formatTimeRange } from "@/utils/formatTimeRange";
import { formatPhoneNumber } from "@/utils/phoneFormating";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./DataModal.module.scss";
import { AccountInput } from "./components/AccountInput";

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
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(dataModalSchema),
  });

  const defaultWhatsapp = data?.candidacy?.candidate.whatsapp;
  const defaultPhone = data?.candidacy?.candidate.phone;
  const defaultCpf = data?.candidacy?.candidate?.cpf;

  const [open, setOpen] = useState(false);
  const [candidate, setCandidate] = useState<ICandidate>();
  const [cpf, setCPF] = useState(defaultCpf ? formatCpf(defaultCpf) : "");
  const [cities, setCities] = useState<SelectType>();
  const [pixType, setPixType] = useState<{ name: string; id: string } | null>(
    null,
  );
  const [pix, setPix] = useState("");
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState<AddressProps>();
  const [whatsapp, setWhatsapp] = useState(
    defaultWhatsapp ? formatPhoneNumber(defaultWhatsapp) : "",
  );
  const [phone, setPhone] = useState(
    defaultPhone ? formatPhoneNumber(defaultPhone) : "",
  );
  const [gender, setGender] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [rg, setRg] = useState("");
  const [identityShippingDate, setIdentityShippingDate] = useState("");
  const [federalUnitRg, setFederalUnitRg] = useState("");
  const [rgUf, setRgUf] = useState("");
  const [ctps, setCtps] = useState("");
  const [ctpsShippingDate, setCtpsShippingDate] = useState("");
  const [pis, setPis] = useState("");
  const [ctpsSerie, setCtpsSerie] = useState("");
  const [ctpsUf, setCtpsUf] = useState("");
  const [bank, setBank] = useState("");
  const [agency, setAgency] = useState("");
  const [account, setAccount] = useState("");
  const [hasCellPhone, setHasCellPhone] = useState(false);
  const [hasCellPc, setHasCellPc] = useState(false);
  const [hasInternet, setHasInternet] = useState(false);
  const [hasDeficiency, setHasDeficiency] = useState(false);
  const [deficiency, setDeficiency] = useState("");
  const [hasMedicalReport, setHasMedicalReport] = useState(false);
  const [hasWeekendObjection, setHasWeekendObjection] = useState(false);
  const [hasTransportVoucher, setHasTransportVoucher] = useState(false);
  const [approved, setApproved] = useState<boolean | null>(null);
  const [schoolings, setSchoolings] = useState<SelectType>();
  const [trainings, setTrainings] = useState<SelectType>();
  const [availabilites, setAvailabilites] = useState<SelectType>();
  const [salaryClaim, setSalaryClaim] = useState<string>(formatCurrency("0"));
  const [transportCompany, setTransportCompany] = useState<string>("");
  const [transportLine, setTransportLine] = useState<string>("");
  const [transportTaxGoing, setTransportTaxGoing] = useState<string>(
    formatCurrency("0"),
  );
  const [transportTaxReturn, setTransportTaxReturn] = useState<string>(
    formatCurrency("0"),
  );
  const [transportTaxDaily, setTransportTaxDaily] = useState<string>(
    formatCurrency("0"),
  );

  const [medicalReportPdf, setMedicalReportPdf] = useState<File>();
  const [curriculumPdf, setCurriculumPdf] = useState<File>();

  const pixRef = useRef<HTMLInputElement | null>(null);

  const { user } = useUser();
  const { data: schoolingsData, isSuccess: isSchoolingsSuccess } =
    useGetAllSchoolingsQuery({
      page: 1,
      size: 999999,
    });
  const { data: trainingsData, isSuccess: isTrainingsSuccess } =
    useGetAllTrainingsQuery({
      page: 1,
      size: 999999,
    });

  function handleOnSave(data: any) {
    setOpen(false);
  }

  const formatRG = (rg: string) => {
    if (!rg) return "";
    const numericRG = rg.replace(/\D/g, "");

    return numericRG.replace(/(\d{2})(\d{3})(\d{3})(\d{1})$/, "$1.$2.$3-$4");
  };

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

  function handleOnChangeCPF(event: ChangeEvent<HTMLInputElement>) {
    const cpf = formatCpf(event.target.value);

    setCPF(cpf);
  }

  function handleOnChangeWhatsapp(event: ChangeEvent<HTMLInputElement>) {
    setWhatsapp(formatPhoneNumber(event.target.value));
  }

  function handleOnChangePhone(event: ChangeEvent<HTMLInputElement>) {
    setPhone(formatPhoneNumber(event.target.value));
  }

  function handleOnSalaryClaimChange(event: ChangeEvent<HTMLInputElement>) {
    setSalaryClaim(formatCurrency(event.target.value));
  }

  function handleOnChangeTransportTaxDaily(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setTransportTaxDaily(formatCurrency(event.target.value));
  }

  function handleOnChangeTransportTaxGoing(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setTransportTaxGoing(formatCurrency(event.target.value));
  }

  function handleOnChangeTransportTaxReturn(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setTransportTaxReturn(formatCurrency(event.target.value));
  }

  function handleOnChangePixKey(value: string, type?: string) {
    const numericValue = value?.replace(/\D/g, "");

    switch (pixType?.name ?? type) {
      case "CPF":
        setPix(formatCpf(numericValue));
        break;
      case "Telefone":
        setPix(formatPhoneNumber(numericValue));
        break;
      default:
        setPix(value);
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

  async function handleOnChangeCep(event: ChangeEvent<HTMLInputElement>) {
    const cep = event.target.value;
    const formattedCEP = formatCEP(cep);
    setCep(formattedCEP);

    if (cep.replace("-", "").length === 8) {
      await getAddressByCep(cep);
    }
  }

  async function onChangeState(id: string) {
    setState(id);
    getCitiesByState(id);
  }

  async function getCandidateData(id: string) {
    const { data } = await getCandidateById({ id });
    setCandidate(data);
  }

  useEffect(() => {
    isSchoolingsSuccess &&
      setSchoolings(
        schoolingsData.schoolings.map(item => ({
          name: item.schoolingName,
          id: item.schoolingName,
        })),
      );
  }, [isSchoolingsSuccess]);

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
        id: `${item.startDay},${item.endDay},${item.startHour},${item.endHour}}`,
      })),
    );
  }, []);

  useEffect(() => {
    if (data) {
      const candidateId = data?.candidacy.candidate.id;
      getCandidateData(candidateId);
    }
  }, [open, data]);

  useEffect(() => {
    if (candidate) {
      setGender(candidate?.gender);
      setCivilStatus(candidate?.civilStatus);
      onChangeState(candidate?.state);
      setCity(candidate?.county);

      setAddress({
        zipCode: candidate?.address?.zipCode,
        address: candidate?.address?.address,
        neighborhood: candidate?.address?.neighborhood,
        complement: candidate?.address?.complement,
        state: candidate?.address?.state,
        number: candidate?.address?.number,
      });

      setCep(formatCEP(candidate?.address?.zipCode));

      setRg(formatRG(candidate?.documents?.identity?.rg));
      setIdentityShippingDate(
        candidate?.documents?.identity?.identityShippingDate,
      );
      setPis(candidate?.documents?.work?.pis);
      setCtps(candidate?.documents?.work?.ctps);
      setFederalUnitRg(candidate?.documents?.identity?.federalUnit);
      setRgUf(candidate?.documents?.identity?.uf);
      setCtpsShippingDate(candidate?.documents?.work?.shippingDate);
      setCtpsSerie(candidate?.documents?.work?.serie);
      setCtpsUf(candidate?.documents?.work?.uf);
      setBank(candidate?.documents?.bank?.bank);
      setAgency(candidate?.documents?.bank?.agency);
      setAccount(candidate?.documents?.bank?.account);
      setPixType({
        id: candidate?.documents?.bank?.pixKeyType,
        name: candidate?.documents?.bank?.pixKeyType,
      });
      handleOnChangePixKey(
        candidate?.documents?.bank?.pixKey,
        candidate?.documents?.bank?.pixKeyType,
      );
      setHasCellPhone(candidate?.complementaryInfo?.hasCellPhone);
      setHasCellPc(candidate?.complementaryInfo?.hasCellPc);
      setHasInternet(candidate?.complementaryInfo?.hasInternet);

      setHasWeekendObjection(candidate?.complementaryInfo?.weekendObjection);

      setDeficiency(candidate?.complementaryInfo?.disabilityDescription);
      setHasDeficiency(candidate?.complementaryInfo?.haveDisability);

      setHasMedicalReport(candidate?.complementaryInfo?.hasMedicalReport);

      setHasTransportVoucher(candidate?.complementaryInfo?.transportVoucher);
      setTransportCompany(candidate?.complementaryInfo?.transportCompany);
      setTransportLine(candidate?.complementaryInfo?.transportLine);
    }
  }, [candidate]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <span>{children}</span>
      </Dialog.Trigger>
      <Dialog.Portal className={styles.modal}>
        <Dialog.Overlay className={styles.modal__overlay} />
        <Dialog.Content className={styles.modal__content}>
          <form onSubmit={handleSubmit(handleOnSave)}>
            <Dialog.Title className={styles.modal__title}>
              {data?.candidacy.candidate.name} -{" "}
              {data?.candidacy?.process?.role?.roleText}
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
                            value={cpf}
                            onChange={e => {
                              onChange(e.target.value);
                              handleOnChangeCPF(e);
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
                            defaultValue={gender}
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
                            defaultValue={civilStatus}
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
                            defaultValue={data?.candidacy?.candidate?.birthdate}
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
                              onChangeState(id);
                            }}
                            placeholder="Selecione"
                            options={states}
                            defaultValue={
                              statesAccronym[
                                state as keyof typeof statesAccronym
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
                            defaultValue={city}
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
                            value={whatsapp}
                            onChange={e => {
                              onChange(e.target.value);
                              handleOnChangeWhatsapp(e);
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
                            value={phone}
                            onChange={e => {
                              onChange(e.target.value);
                              handleOnChangePhone(e);
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
                    <InputContainer title="CEP">
                      <input
                        type="text"
                        id="CEP"
                        value={cep}
                        onChange={handleOnChangeCep}
                        maxLength={9}
                      />
                    </InputContainer>

                    <InputContainer title="Logradouro">
                      <input
                        type="text"
                        id="Logradouro"
                        value={address?.address}
                      />
                    </InputContainer>

                    <InputContainer title="Endereço">
                      <input type="text" id="Endereço" />
                    </InputContainer>

                    <InputContainer title="Bairro">
                      <input
                        type="text"
                        id="Bairro"
                        value={address?.neighborhood}
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
                        value={address?.number}
                      />
                    </InputContainer>

                    <InputContainer title="Complemento">
                      <input
                        type="text"
                        id="Complemento"
                        value={address?.complement}
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
                            value={rg}
                            onChange={e => {
                              if (!e.target.validity.valid) {
                                e.target.value = "";
                                return;
                              }
                              onChange(e.target.value);
                              setRg(formatRG(e.target.value));
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
                            defaultValue={identityShippingDate}
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
                            defaultValue={federalUnitRg}
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
                                rgUf?.toUpperCase() as keyof typeof statesAccronym
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
                            defaultValue={pis}
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
                            defaultValue={ctps}
                            pattern="\d*"
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
                            defaultValue={ctpsShippingDate}
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
                            defaultValue={ctpsSerie}
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
                                ctpsUf?.toUpperCase() as keyof typeof statesAccronym
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
                            defaultValue={bank}
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
                        <InputContainer title="Agência" error={error?.message}>
                          <input
                            type="text"
                            id="Agência"
                            value={agency}
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
                            defaultValue={account}
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
                              setPix("");
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
                            defaultValue={pixType?.id}
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
                            pattern={
                              pixType?.id === "CPF" ||
                              pixType?.id === "Telefone"
                                ? "d*"
                                : undefined
                            }
                            maxLength={
                              pixType?.id === "Chave aleatória" ? 32 : undefined
                            }
                            id="Chave PIX"
                            value={pix}
                            disabled={!pixType?.id}
                            onChange={e => {
                              handleOnChangePixKey(e.target.value);
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
                            defaultValue={hasCellPhone}
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
                            defaultValue={hasCellPc}
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
                            defaultValue={hasInternet}
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
                            defaultValue={hasWeekendObjection}
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
                              setHasDeficiency(val);
                              onChange(val);
                            }}
                            defaultValue={hasDeficiency}
                          />
                        </InputContainer>
                      )}
                    />

                    {hasDeficiency && (
                      <Controller
                        control={control}
                        name="complementaryInfo.disabilityDescription"
                        render={({
                          field: { onChange },
                          fieldState: { error },
                        }) => (
                          <InputContainer title="Qual?" error={error?.message}>
                            <input
                              type="text"
                              id="Qual?"
                              defaultValue={deficiency}
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
                              setHasMedicalReport(val);
                              onChange(val);
                            }}
                            defaultValue={hasMedicalReport}
                          />
                        </InputContainer>
                      )}
                    />

                    {hasMedicalReport && (
                      <InputContainer title="Anexar arquivo">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 8,
                          }}
                        >
                          <FileInput
                            onChange={file => setMedicalReportPdf(file)}
                            maxSize={5}
                            allowedTypes={["pdf"]}
                          />
                          <a
                            href={
                              medicalReportPdf &&
                              URL.createObjectURL(medicalReportPdf)
                            }
                            target="_blank"
                            style={{ alignSelf: "flex-end", cursor: "pointer" }}
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
                              setHasTransportVoucher(val);
                              onChange(val);
                            }}
                            defaultValue={hasTransportVoucher}
                          />
                        </InputContainer>
                      )}
                    />
                  </div>

                  {hasTransportVoucher && (
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
                                defaultValue={transportCompany}
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
                                defaultValue={transportLine}
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
                                value={transportTaxGoing}
                                onChange={e => {
                                  handleOnChangeTransportTaxGoing(e);
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
                                value={transportTaxReturn}
                                onChange={e => {
                                  handleOnChangeTransportTaxReturn(e);
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
                                value={transportTaxDaily}
                                onChange={e => {
                                  handleOnChangeTransportTaxDaily(e);
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
                    <InputContainer title="Disponibilidade" width={"45%"}>
                      <Select
                        onChange={() => {}}
                        placeholder="Selecione"
                        options={availabilites ?? []}
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
                      <Select
                        onChange={() => {}}
                        placeholder="Selecione"
                        options={schoolings ?? []}
                      />
                    </InputContainer>

                    <InputContainer title="Curso">
                      <input type="text" id="Curso" />
                    </InputContainer>

                    <InputContainer title="Status" width={"20%"}>
                      <Select
                        onChange={() => {}}
                        options={StatusSelect}
                        placeholder="Selecione"
                      />
                    </InputContainer>
                  </div>
                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Período">
                      <Select
                        onChange={() => {}}
                        options={PeriodSelect}
                        placeholder="Selecione"
                      />
                    </InputContainer>
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
                            style={{ alignSelf: "flex-end", cursor: "pointer" }}
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
                    <InputContainer title="Resultado">
                      <Select
                        onChange={({ name }) => {
                          setApproved(name === "Aprovado");
                        }}
                        options={results}
                        placeholder="Selecione"
                      />
                    </InputContainer>

                    {approved && (
                      <InputContainer title="Treinamento" width={"30%"}>
                        <Select
                          onChange={() => {}}
                          placeholder="Selecione"
                          options={trainings ?? []}
                        />
                      </InputContainer>
                    )}

                    {approved === false && (
                      <InputContainer title="Motivo">
                        <input type="text" id="Motivo" />
                      </InputContainer>
                    )}
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
  error,
}: {
  title: string;
  children: ReactNode;
  htmlFor?: string;
  width?: number | string;
  lightTitle?: string;
  error?: string;
}) {
  return (
    <div className={styles.modal__content__form__input} style={{ width }}>
      <div className={styles.label__container}>
        <label htmlFor={htmlFor || title}>{title}</label>
        {lightTitle && <span>{lightTitle}</span>}
      </div>
      {children}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}
