import { ReactNode, useEffect, useState } from "react";
import { Select } from "../Select";
import styles from "./StepOne.module.scss";
import { TipTap } from "../TipTap";
import { LocalSelect } from "../LocalSelect";
import {
  useGetAllRolesQuery,
  useGetAllUnitsQuery,
} from "@/services/api/fetchApi";
import { Radio } from "../Radio";
import { NumberInput } from "../NumberInput";
import { FileInput } from "../FileInput";
import { Button } from "../Button";
import { ArrowCircleRight } from "@/assets/Icons";
import { useRouter } from "next/navigation";

export function StepOne({
  handleTogglePage,
}: {
  handleTogglePage: (page: number) => void;
}) {
  const { back } = useRouter();

  const [unitOptions, setUnitOptions] = useState<string[]>([]);
  const [roleOptions, setRoleOptions] = useState<string[]>([]);

  const { data, isSuccess } = useGetAllUnitsQuery({ page: 1, size: 9999 });
  const { data: RoleData, isSuccess: RoleDataSucess } = useGetAllRolesQuery({
    page: 1,
    size: 9999,
  });

  function getObservations(content: any) {
    // console.log(content);
  }

  function getLastMessage(content: any) {
    // console.log(content);
  }

  function getUnit(value: string) {
    // console.log(value);
  }

  function getRole(value: string) {
    // console.log(value);
  }

  function onChangeRadio(value: boolean) {
    // console.log(value);
  }

  function onChangeCandidates(value: number) {
    // console.log(value);
  }

  function onChangeFile(file: File) {
    // console.log(event.target.files[0]);
  }

  useEffect(() => {
    if (isSuccess) {
      const units = data?.units.map(unit => unit.unitName);
      setUnitOptions(units ?? []);
    }

    if (RoleDataSucess) {
      const roles = RoleData?.roles.map(role => role.roleText);
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
              onChange={getUnit}
            />
          </DataInput>
          <DataInput name="Cargo" required width="448px">
            <LocalSelect
              placeholder="Selecione os locais"
              options={roleOptions}
              onChange={getRole}
            />
          </DataInput>
          <DataInput name="Currículo" width="264px" required>
            <Radio onChange={onChangeRadio} />
          </DataInput>
        </div>

        <div className={styles.container__form__second}>
          <DataInput name="Data inicial" width="224px" required>
            <input type="date" />
          </DataInput>
          <DataInput name="Inscrições até" width="224px">
            <input type="date" />
          </DataInput>
          <DataInput name="Limite de candidaturas" width="224px">
            <NumberInput onChange={onChangeCandidates} />
          </DataInput>
          <DataInput name="Upload banner vaga" width="301px" required>
            <FileInput onChange={onChangeFile} />
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

function DataInput({
  name,
  width,
  required = false,
  children,
}: {
  name: string;
  width?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={styles.dataInput} style={{ width }}>
      <label htmlFor={name}>
        {name}
        {required && <span>*</span>}
      </label>
      <label htmlFor={name}>{!required && <p>(opcional)</p>}</label>
      {children}
    </div>
  );
}
