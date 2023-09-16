import { Close } from "@/assets/Icons";
import { FileInput } from "@/components/FileInput";
import { Radio } from "@/components/Radio";
import { Select } from "@/components/Select";
import useUser from "@/hooks/useUser";
import { InterviewType } from "@/interfaces/interviews.interface";
import {
  useGetAllSchoolingsQuery,
  useGetAllTrainingsQuery,
} from "@/services/api/fetchApi";
import { genders, maritalStatus, results, states } from "@/utils/datamodal";
import { formatCpf } from "@/utils/formatCpf";
import { formatPhoneNumber } from "@/utils/phoneFormating";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
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

export function DataModal({ children, data }: DataModalProps) {
  const defaultWhatsapp = data?.candidacy?.candidate.whatsapp;
  const defaultPhone = data?.candidacy?.candidate.phone;
  const defaultCpf = data?.candidacy?.candidate?.cpf;

  const [open, setOpen] = useState(false);
  const [cpf, setCPF] = useState(defaultCpf ? formatCpf(defaultCpf) : "");
  const [cities, setCities] = useState<Array<{ name: string; id: string }>>();
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState<AddressProps>();
  const [whatsapp, setWhatsapp] = useState(
    defaultWhatsapp ? formatPhoneNumber(defaultWhatsapp) : "",
  );
  const [phone, setPhone] = useState(
    defaultPhone ? formatPhoneNumber(defaultPhone) : "",
  );
  const [rg, setRg] = useState("");
  const [hasDeficiency, setHasDeficiency] = useState(false);
  const [hasMedicalReport, setHasMedicalReport] = useState(false);
  const [hasTransportVoucher, setHasTransportVoucher] = useState(false);
  const [approved, setApproved] = useState<boolean | null>(null);
  const [schoolings, setSchoolings] =
    useState<Array<{ name: string; id: string }>>();
  const [trainings, setTrainings] =
    useState<Array<{ name: string; id: string }>>();
  const [salaryClaim, setSalaryClaim] = useState<string>("");
  const [transportTaxGoing, setTransportTaxGoing] = useState<string>("");
  const [transportTaxReturn, setTransportTaxReturn] = useState<string>("");
  const [transportTaxDaily, setTransportTaxDaily] = useState<string>("");

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
  function formatCPF(value: string) {
    const numericValue = value.replace(/\D/g, "");

    const formattedValue = numericValue.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-$4",
    );

    return formattedValue;
  }

  const formatRG = (rg: string) => {
    const numericRG = rg.replace(/\D/g, "");

    const formattedRG = numericRG.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{1})$/,
      "$1.$2.$3-$4",
    );
    return formattedRG;
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "");

    const formattedValue = (+numericValue / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return formattedValue;
  };

  function onChangeGender() {}

  function onChangeMaritalStatus() {}

  function handleOnChangeCPF(event: ChangeEvent<HTMLInputElement>) {
    const cpf = formatCPF(event.target.value);

    cpf && setCPF(cpf);
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

  async function getCitiesByState(id: string) {
    const cities: Array<{ name: string; id: string }> = [];
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
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    const data: AddressProps = response.data;

    setAddress(data);
  }

  async function handleOnChangeCep(event: ChangeEvent<HTMLInputElement>) {
    const cep = event.target.value;
    setCep(cep);

    if (cep.length === 8) {
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
                        maxLength={12}
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
                        height={200}
                      />
                    </InputContainer>

                    <InputContainer title="Município" htmlFor="city">
                      <Select
                        onChange={() => {}}
                        placeholder="Selecione"
                        options={cities ?? []}
                        height={200}
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
                        defaultFalse={false}
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
                        height={200}
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
                        type="number"
                        id="Número do PIS"
                        maxLength={11}
                        min={0}
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
                        type="number"
                        id="Número da CTPS"
                        min={0}
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
                        height={200}
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
                      <Radio column lightTheme defaultFalse={false} />
                    </InputContainer>

                    <InputContainer title="Possui computador?">
                      <Radio column lightTheme defaultFalse={false} />
                    </InputContainer>

                    <InputContainer title="Possui internet?">
                      <Radio column lightTheme defaultFalse={false} />
                    </InputContainer>
                  </div>

                  <div
                    className={
                      styles.modal__content__form__item__inputs__container
                    }
                  >
                    <InputContainer title="Possui objeção em trabalhar algum dia da semana?">
                      <Radio column lightTheme defaultFalse={false} />
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
                        defaultFalse={false}
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
                        defaultFalse={false}
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
                          <FileInput onChange={() => {}} />
                          <a href="#" style={{ alignSelf: "flex-end" }}>
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
                        defaultFalse={false}
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
                    <InputContainer title="Escolaridade" width={"30%"}>
                      <Select
                        onChange={() => {}}
                        placeholder="Selecione"
                        options={schoolings ?? []}
                        height={200}
                      />
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
                          <FileInput onChange={() => {}} />
                          <a href="#" style={{ alignSelf: "flex-end" }}>
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
                          height={200}
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
