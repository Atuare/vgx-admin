import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { Select } from "../Select";
import styles from "./StepOne.module.scss";
import { TipTap } from "../TipTap";
import {
  useGetAllRolesQuery,
  useGetAllUnitsQuery,
} from "@/services/api/fetchApi";
import { Radio } from "../Radio";
import { NumberInput } from "../NumberInput";
import { FileInput } from "../FileInput";
import { DataInput } from "../DataInput";
import { Button } from "../Button";
import { ArrowCircleRight } from "@/assets/Icons";
import { useRouter } from "next/navigation";

export function StepOne({
  handleTogglePage,
  setProcessData,
}: {
  handleTogglePage: (page: number) => void;
  setProcessData: (data: any) => void;
}) {
  const { back } = useRouter();

  const [unit, setUnit] = useState<{ name: string; id: string }>();
  const [role, setRole] = useState<{ name: string; id: string }>();
  const [curriculum, setCurriculum] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [limitCandidates, setLimitCandidates] = useState<number>(0);
  const [observations, setObservations] = useState<any>("");
  const [registrationCompletionMessage, setRegistrationCompletionMessage] =
    useState<any>();
  const [file, setFile] = useState<File | null>(null);

  const [unitOptions, setUnitOptions] = useState<
    { name: string; id: string }[] | []
  >([]);
  const [roleOptions, setRoleOptions] = useState<
    { name: string; id: string }[] | []
  >([]);

  const { data, isSuccess } = useGetAllUnitsQuery({ page: 1, size: 9999 });
  const { data: RoleData, isSuccess: RoleDataSucess } = useGetAllRolesQuery({
    page: 1,
    size: 9999,
  });

  function getObservations(content: any) {
    setObservations(JSON.stringify(content));
  }

  function getLastMessage(content: any) {
    setRegistrationCompletionMessage(JSON.stringify(content));
  }

  function handleChangeFile(file: File) {
    setFile(file);
  }

  function handleChangeStartDate(e: ChangeEvent<HTMLInputElement>) {
    if (e?.target?.value) setStartDate(new Date(e.target.value).toISOString());
  }

  function handleChangeEndDate(e: ChangeEvent<HTMLInputElement>) {
    if (e?.target?.value) setEndDate(new Date(e.target.value).toISOString());
  }

  useEffect(() => {
    setProcessData({
      unit,
      role,
      curriculum,
      startDate,
      endDate,
      limitCandidates,
      file,
      observations,
      registrationCompletionMessage,
    });
  }, [
    unit,
    role,
    curriculum,
    startDate,
    endDate,
    limitCandidates,
    file,
    observations,
    registrationCompletionMessage,
  ]);

  useEffect(() => {
    if (isSuccess) {
      const units = data?.units.map(unit => {
        return { name: unit.unitName, id: unit.id };
      });
      setUnitOptions(units ?? []);
    }

    if (RoleDataSucess) {
      const roles = RoleData?.roles.map(role => {
        return { name: role.roleText, id: role.id };
      });
      setRoleOptions(roles ?? []);
    }
  }, [isSuccess, RoleDataSucess]);

  return (
    <div className={styles.container}>
      <section className={styles.container__form}>
        <div className={styles.container__form__first}>
          <DataInput name="Unidade/Site" required width="296px">
            <Select
              placeholder="Selecione os locais"
              options={unitOptions}
              onChange={value => setUnit(value)}
            />
          </DataInput>
          <DataInput name="Cargo" required width="448px">
            <Select
              placeholder="Selecione"
              options={roleOptions}
              onChange={value => setRole(value)}
            />
          </DataInput>
          <DataInput name="Solicitar currículo" width="264px" required>
            <Radio onChange={value => setCurriculum(value)} />
          </DataInput>
        </div>

        <div className={styles.container__form__second}>
          <DataInput name="Data inicial" width="224px" required>
            <input type="date" onChange={handleChangeStartDate} />
          </DataInput>
          <DataInput name="Inscrições até" width="224px">
            <input type="date" onChange={handleChangeEndDate} />
          </DataInput>
          <DataInput name="Limite de candidaturas" width="224px">
            <NumberInput onChange={value => setLimitCandidates(value)} />
          </DataInput>
          <DataInput name="Upload banner vaga" width="301px" required>
            <FileInput onChange={handleChangeFile} />
          </DataInput>
        </div>
      </section>

      <div className={styles.container__editor}>
        <h1>
          Observações <span>(opcional)</span>
        </h1>
        <TipTap getContentFromEditor={getObservations} />
      </div>

      <div className={styles.container__editor}>
        <h1>
          Mensagem exibida ao final do cadastro <span>(opcional)</span>
        </h1>
        <TipTap getContentFromEditor={getLastMessage} />
      </div>

      <div className={styles.container__buttons}>
        <Button buttonType="default" text="Cancelar" onClick={() => back()} />
        <Button
          buttonType="primary"
          text="Próximo"
          icon={<ArrowCircleRight />}
          onClick={() => handleTogglePage(2)}
        />
      </div>
    </div>
  );
}
