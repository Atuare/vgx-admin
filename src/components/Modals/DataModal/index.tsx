import { Close } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { FileInput } from "@/components/FileInput";
import { Radio } from "@/components/Radio";
import { Select } from "@/components/Select";
import useUser from "@/hooks/useUser";
import { InterviewType } from "@/interfaces/interviews.interface";
import {
  useGetAllAvailabilitiesQuery,
  useGetAllSchoolingsQuery,
  useGetAllTrainingsQuery,
} from "@/services/api/fetchApi";
import {
  StatusSelect,
  genders,
  maritalStatus,
  pixTypes,
  results,
  states,
} from "@/utils/datamodal";
import { formatCpf } from "@/utils/formatCpf";
import { formatTimeRange } from "@/utils/formatTimeRange";
import { formatPhoneNumber } from "@/utils/phoneFormating";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";
import styles from "./DataModal.module.scss";

interface DataModalProps {
  children: ReactNode;
  data?: InterviewType;
}

interface AddressProps {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

type SelectType = {
  name: string;
  id: string;
}[];

export function DataModal({ children, data }: DataModalProps) {
  const defaultWhatsapp = data?.candidacy?.candidate.whatsapp;
  const defaultPhone = data?.candidacy?.candidate.phone;
  const defaultCpf = data?.candidacy?.candidate?.cpf;

  const [open, setOpen] = useState(false);
  const [cpf, setCPF] = useState(defaultCpf ? formatCpf(defaultCpf) : "");
  const [cities, setCities] = useState<SelectType>();
  const [pixType, setPixType] = useState<{ name: string; id: string }>();
  const [pix, setPix] = useState("");
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState<AddressProps>();
  const [whatsapp, setWhatsapp] = useState(
    defaultWhatsapp ? formatPhoneNumber(defaultWhatsapp) : "",
  );
  const [phone, setPhone] = useState(
    defaultPhone ? formatPhoneNumber(defaultPhone) : "",
  );
  const [rg, setRg] = useState("");
  const [firstAccount, setFirstAccount] = useState("");
  const [secondAccount, setSecondAccount] = useState("");
  const [hasDeficiency, setHasDeficiency] = useState(false);
  const [hasMedicalReport, setHasMedicalReport] = useState(false);
  const [hasTransportVoucher, setHasTransportVoucher] = useState(false);
  const [approved, setApproved] = useState<boolean | null>(null);
  const [schoolings, setSchoolings] = useState<SelectType>();
  const [trainings, setTrainings] = useState<SelectType>();
  const [availabilites, setAvailabilites] = useState<SelectType>();
  const [salaryClaim, setSalaryClaim] = useState<string>(formatCurrency("0"));
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

  const backAccountFirstInput = useRef<HTMLInputElement | null>(null);
  const backAccountSecondInput = useRef<HTMLInputElement | null>(null);

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
  const { data: availabilitesData, isSuccess: isAvailabilitiesSuccess } =
    useGetAllAvailabilitiesQuery({ page: 1, size: 99999999 });

  function handleOnSave(data: any) {
    setOpen(false);
  }

  const formatRG = (rg: string) => {
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
    const cepValue = cepInput.replace(/\D/g, "");

    const formattedCepValue = cepValue
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d{3})/, "$1-$2");

    return formattedCepValue;
  }

  function onChangeGender() {}

  function onChangeMaritalStatus() {}

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

  function handleChangeBankAccount(
    event: ChangeEvent<HTMLInputElement>,
    index: number,
  ) {
    const numericValue = event.target.value.replace(/\D/g, "");

    if (numericValue.length >= 7) {
      backAccountSecondInput.current?.focus();
    }

    index === 0
      ? setFirstAccount(numericValue)
      : setSecondAccount(numericValue);
  }

  function handleOnChangePixKey(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    const numericValue = value.replace(/\D/g, "");

    switch (pixType?.name) {
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
    const data: AddressProps = response.data;

    setAddress(data);
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
    getCitiesByState(id);
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
    isAvailabilitiesSuccess &&
      setAvailabilites(
        availabilitesData.availabilities.map(item => ({
          name: formatTimeRange(item),
          id: `${item.startDay},${item.endDay},${item.startHour},${item.endHour}}`,
        })),
      );
  }, [isAvailabilitiesSuccess]);

  useEffect(() => {
    setPix("");
  }, [pixType]);

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
                    <InputContainer title="Nome">
                      <input
                        type="text"
                        id="Nome"
                        style={{ width: 272 }}
                        defaultValue={data?.candidacy?.candidate?.name}
                      />
                    </InputContainer>

                    <InputContainer title="CPF">
                      <input
                        type="text"
                        id="CPF"
                        value={cpf}
                        onChange={handleOnChangeCPF}
                        maxLength={14}
                      />
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
                        maxHeight={250}
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
                        defaultValue={data?.candidacy?.candidate?.birthdate}
                      />
                    </InputContainer>

                    <InputContainer
                      title="Estado"
                      htmlFor="state"
                      width={"30%"}
                    >
                      <Select
                        onChange={({ id }) => onChangeState(id)}
                        placeholder="Selecione"
                        options={states}
                      />
                    </InputContainer>

                    <InputContainer title="Município" htmlFor="city">
                      <Select
                        onChange={() => {}}
                        placeholder="Selecione"
                        options={cities ?? []}
                        width={200}
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
                        value={whatsapp}
                        onChange={handleOnChangeWhatsapp}
                      />
                    </InputContainer>

                    <InputContainer title="Telefone" htmlFor="phone">
                      <input
                        type="text"
                        id="phone"
                        value={phone}
                        onChange={handleOnChangePhone}
                      />
                    </InputContainer>

                    <InputContainer title="E-mail" htmlFor="email" width={272}>
                      <input
                        type="email"
                        id="email"
                        defaultValue={data?.candidacy?.candidate?.email}
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
                        defaultValue={data?.candidacy?.candidate?.motherName}
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
                        defaultValue={data?.candidacy?.candidate?.fatherName}
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
                        defaultValue={
                          data?.candidacy?.candidate?.childUnderfourteen
                        }
                      />
                    </InputContainer>

                    <InputContainer title="Número de filhos">
                      <input
                        type="number"
                        style={{ width: 80 }}
                        min={0}
                        defaultValue={data?.candidacy?.candidate?.childCount}
                        onChange={e => {
                          if (!e.target.validity.valid) {
                            e.target.value = "";
                          }
                        }}
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
                        value={cep}
                        onChange={handleOnChangeCep}
                        maxLength={9}
                      />
                    </InputContainer>

                    <InputContainer title="Logradouro">
                      <input
                        type="text"
                        id="Logradouro"
                        value={address?.logradouro}
                      />
                    </InputContainer>

                    <InputContainer title="Endereço">
                      <input type="text" id="Endereço" />
                    </InputContainer>

                    <InputContainer title="Bairro">
                      <input type="text" id="Bairro" value={address?.bairro} />
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
                      <input
                        type="text"
                        id="Complemento"
                        value={address?.complemento}
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
                        value={rg}
                        onChange={e => {
                          setRg(formatRG(e.target.value));
                          if (!e.target.validity.valid) {
                            e.target.value = "";
                          }
                        }}
                        maxLength={9}
                      />
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

                    <InputContainer title="UF" width={"30%"}>
                      <Select
                        onChange={() => {}}
                        placeholder="Selecione"
                        options={states}
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
                        maxLength={11}
                        pattern="\d*"
                        onChange={e => {
                          if (!e.target.validity.valid) {
                            e.target.value = "";
                          }
                        }}
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
                        pattern="\d*"
                        maxLength={11}
                        onChange={e => {
                          if (!e.target.validity.valid) {
                            e.target.value = "";
                          }
                        }}
                      />
                    </InputContainer>

                    <InputContainer
                      title="Data de expedição"
                      htmlFor="expeditionDate"
                    >
                      <input type="date" id="expeditionDate" />
                    </InputContainer>

                    <InputContainer title="Série">
                      <input type="text" id="Série" />
                    </InputContainer>

                    <InputContainer title="UF" width={"30%"}>
                      <Select
                        onChange={() => {}}
                        placeholder="Selecione"
                        options={states}
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
                      <input type="text" id="Banco" />
                    </InputContainer>

                    <InputContainer title="Agência">
                      <input
                        type="text"
                        id="Agência"
                        maxLength={4}
                        pattern="\d*"
                        onChange={e => {
                          if (!e.target.validity.valid) {
                            e.target.value = "";
                          }
                        }}
                      />
                    </InputContainer>

                    <InputContainer title="Conta">
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          type="text"
                          id="Conta"
                          pattern="\d*"
                          maxLength={7}
                          value={firstAccount}
                          ref={backAccountFirstInput}
                          onChange={e => {
                            handleChangeBankAccount(e, 0);
                          }}
                        />

                        <input
                          style={{ width: 80 }}
                          pattern="\d*"
                          maxLength={1}
                          value={secondAccount}
                          onChange={e => {
                            handleChangeBankAccount(e, 1);
                          }}
                          onKeyDown={e => {
                            if (
                              e.key === "Backspace" &&
                              secondAccount.trim() === ""
                            ) {
                              setTimeout(() => {
                                backAccountFirstInput.current?.focus();
                              }, 1);
                            }
                          }}
                          ref={backAccountSecondInput}
                        />
                      </div>
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Tipo chave PIX" width={"20%"}>
                      <Select
                        onChange={setPixType}
                        options={pixTypes}
                        placeholder="Selecione"
                        maxHeight={250}
                      />
                    </InputContainer>

                    <InputContainer title="Chave PIX">
                      <input
                        type={pixType?.id === "E-mail" ? "email" : "text"}
                        pattern={
                          pixType?.id === "CPF" || pixType?.id === "Telefone"
                            ? "d*"
                            : undefined
                        }
                        maxLength={
                          pixType?.id === "Chave aleatória" ? 32 : undefined
                        }
                        id="Chave PIX"
                        value={pix}
                        disabled={!pixType}
                        onChange={handleOnChangePixKey}
                        style={{ cursor: !pixType ? "not-allowed" : "text" }}
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
                      <input
                        type="text"
                        id="Pretensão salarial"
                        onChange={handleOnSalaryClaimChange}
                        value={salaryClaim}
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
                        onChange={val => setHasDeficiency(val)}
                      />
                    </InputContainer>

                    {hasDeficiency && (
                      <InputContainer title="Qual?">
                        <input type="text" id="Qual?" />
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
                        onChange={val => setHasMedicalReport(val)}
                      />
                    </InputContainer>

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
                    <InputContainer
                      title="Opta por receber vale transporte?"
                      lightTitle="(vagas presenciais)"
                    >
                      <Radio
                        column
                        lightTheme
                        onChange={val => setHasTransportVoucher(val)}
                      />
                    </InputContainer>
                  </div>

                  {hasTransportVoucher && (
                    <>
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
                          <input
                            type="string"
                            id="Tarifa de ida"
                            value={transportTaxGoing}
                            onChange={handleOnChangeTransportTaxGoing}
                          />
                        </InputContainer>

                        <InputContainer title="Tarifa de volta">
                          <input
                            type="string"
                            id="Tarifa de volta"
                            value={transportTaxReturn}
                            onChange={handleOnChangeTransportTaxReturn}
                          />
                        </InputContainer>

                        <InputContainer title="Tarifa diária">
                          <input
                            type="string"
                            id="Tarifa diária"
                            value={transportTaxDaily}
                            onChange={handleOnChangeTransportTaxDaily}
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
                      <input type="text" id="Período" />
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
