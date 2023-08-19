import { ArrowCircleRight } from "@/assets/Icons";
import {
  useGetAllAvailabilitiesQuery,
  useGetAllBenefitsQuery,
  useGetAllSchoolingsQuery,
  useGetAllSkillsQuery,
} from "@/services/api/fetchApi";
import { formatTimeRange } from "@/utils/formatTimeRange";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../Button";
import { CheckBoard } from "../CheckBoard";
import { Checkbox } from "../Checkbox";
import { DataInput } from "../DataInput";
import { Radio } from "../Radio";
import styles from "./StepTwo.module.scss";

export function StepTwo({
  handleTogglePage,
  currentProcessData,
  setProcessData,
}: {
  handleTogglePage: (page: number) => void;
  currentProcessData: any;
  setProcessData: (data: any) => void;
}) {
  const { back } = useRouter();

  const [availableForMinors, setAvailableForMinors] = useState<boolean>(false);
  const [availabilities, setAvailabilities] = useState<
    { name: string; id: string }[]
  >([]);
  const [schoolings, setSchoolings] = useState<
    {
      name: string;
      id: string;
    }[]
  >([]);
  const [skills, setSkills] = useState<{ name: string; id: string }[]>([]);
  const [benefits, setBenefits] = useState<{ name: string; id: string }[]>([]);
  const [type, setType] = useState<string>("");

  const { data: avaiabilitiesData } = useGetAllAvailabilitiesQuery({
    page: 1,
    size: 999,
  });
  const { data: schoolingsData } = useGetAllSchoolingsQuery({
    page: 1,
    size: 999,
  });
  const { data: skillsData } = useGetAllSkillsQuery({ page: 1, size: 999 });
  const { data: benefitsData } = useGetAllBenefitsQuery({ page: 1, size: 999 });

  const handleChangeModality = (value: boolean) => {
    if (value) {
      setType("PRESENCIAL");
    } else {
      setType("REMOTO");
    }
  };

  useEffect(() => {
    setProcessData({
      ...currentProcessData,
      availableForMinors,
      availabilities,
      schoolings,
      skills,
      benefits,
      type,
    });
  }, [availableForMinors, availabilities, schoolings, skills, benefits, type]);

  return (
    <div className={styles.container}>
      <section className={styles.container__form}>
        <CheckBoard
          title="Disponibilidade de horários / Turnos"
          options={
            avaiabilitiesData?.availabilities.map(item => ({
              name: formatTimeRange(item),
              id: item.id,
            })) || []
          }
          onChange={value => setAvailabilities(value.map(item => item))}
        />
        <CheckBoard
          title="Escolaridade"
          options={
            schoolingsData?.schoolings.map(item => ({
              name: item.schoolingName,
              id: item.id,
            })) || []
          }
          onChange={value => setSchoolings(value.map(item => item))}
        />
        <CheckBoard
          title="Habilidades"
          options={
            skillsData?.skills.map(item => ({
              name: item.skillText,
              id: item.id,
            })) || []
          }
          onChange={value => setSkills(value.map(item => item))}
        />
        <CheckBoard
          title="Benefícios"
          options={
            benefitsData?.benefits.map(item => ({
              name: item.benefitName,
              id: item.id,
            })) || []
          }
          onChange={value => setBenefits(value.map(item => item))}
        />
        <DataInput name="Tipo" width="328px" required>
          <Radio
            options={["Presencial", "Remoto"]}
            onChange={handleChangeModality}
          />
        </DataInput>
        <div className={styles.container__form__checkBox}>
          <Checkbox
            iconType="solid"
            isActive={availableForMinors}
            value="Processo disponível para menores de 18 anos"
            onChangeCheckbox={() => setAvailableForMinors(!availableForMinors)}
            style={{ padding: 0 }}
          />
        </div>
        <div className={styles.container__form__buttons}>
          <Button buttonType="default" text="Cancelar" onClick={() => back()}>
            Cancelar
          </Button>
          <Button
            buttonType="primary"
            text="Próximo"
            icon={<ArrowCircleRight />}
            onClick={() => handleTogglePage(3)}
          />
        </div>
      </section>
    </div>
  );
}
