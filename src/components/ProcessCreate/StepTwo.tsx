import { ArrowCircleRight } from "@/assets/Icons";
import { processCreateStepTwoSchema } from "@/schemas/processCreateSchema";
import {
  useGetAllAvailabilitiesQuery,
  useGetAllBenefitsQuery,
  useGetAllSchoolingsQuery,
  useGetAllSkillsQuery,
} from "@/services/api/fetchApi";
import { formatTimeRange } from "@/utils/formatTimeRange";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
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
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(processCreateStepTwoSchema),
    defaultValues: {
      availableForMinors: false,
    },
  });

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

  function onSubmit(data: any) {
    setProcessData({
      ...currentProcessData,
      availableForMinors: data.availableForMinors,
      availabilities: data.availabilities,
      schoolings: data.schoolings,
      skills: data.skills,
      benefits: data.benefits,
      type: data.type,
    });

    handleTogglePage(3);
  }

  return (
    <form
      id="process-create"
      onSubmit={handleSubmit(onSubmit)}
      className={styles.container}
    >
      <section className={styles.container__form}>
        <Controller
          name="availabilities"
          control={control}
          render={({ field: { onChange }, fieldState: { error } }) => (
            <CheckBoard
              title="Disponibilidade de horários / Turnos"
              options={
                avaiabilitiesData?.availabilities.map(item => ({
                  name: formatTimeRange(item),
                  id: item.id,
                })) || []
              }
              error={error?.message}
              onChange={value => onChange(value)}
            />
          )}
        />

        <Controller
          name="schoolings"
          control={control}
          render={({ field: { onChange }, fieldState: { error } }) => (
            <CheckBoard
              title="Escolaridade"
              options={
                schoolingsData?.schoolings.map(item => ({
                  name: item.schoolingName,
                  id: item.id,
                })) || []
              }
              error={error?.message}
              onChange={value => onChange(value)}
            />
          )}
        />

        <Controller
          name="skills"
          control={control}
          render={({ field: { onChange }, fieldState: { error } }) => (
            <CheckBoard
              title="Habilidades"
              options={
                skillsData?.skills.map(item => ({
                  name: item.skillText,
                  id: item.id,
                })) || []
              }
              error={error?.message}
              onChange={value => onChange(value)}
            />
          )}
        />

        <Controller
          name="benefits"
          control={control}
          render={({ field: { onChange }, fieldState: { error } }) => (
            <CheckBoard
              title="Benefícios"
              options={
                benefitsData?.benefits.map(item => ({
                  name: item.benefitName,
                  id: item.id,
                })) || []
              }
              error={error?.message}
              onChange={value => onChange(value)}
            />
          )}
        />

        <Controller
          name="type"
          control={control}
          render={({ field: { onChange }, fieldState: { error } }) => (
            <DataInput
              name="Tipo"
              width="328px"
              required
              error={error?.message}
            >
              <Radio
                options={["Presencial", "Remoto"]}
                onChange={value => {
                  if (value) {
                    onChange("PRESENCIAL");
                  } else {
                    onChange("REMOTO");
                  }
                }}
              />
            </DataInput>
          )}
        />

        <Controller
          name="type"
          control={control}
          render={({ field: { onChange }, fieldState: { error } }) => (
            <div className={styles.container__form__checkBox}>
              <Checkbox
                iconType="solid"
                value="Processo disponível para menores de 18 anos"
                onChangeCheckbox={value => onChange(value)}
              />
            </div>
          )}
        />
        <div className={styles.container__form__buttons}>
          <Button
            type="button"
            buttonType="default"
            text="Cancelar"
            onClick={() => back()}
          >
            Cancelar
          </Button>
          <Button
            buttonType="primary"
            text="Próximo"
            icon={<ArrowCircleRight />}
            form="process-create"
          />
        </div>
      </section>
    </form>
  );
}
