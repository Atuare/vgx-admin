import { ArrowCircleRight } from "@/assets/Icons";
import { processEditStepTwoSchema } from "@/schemas/processEditSchema";
import {
  useGetAllAvailabilitiesQuery,
  useGetAllBenefitsQuery,
  useGetAllSchoolingsQuery,
  useGetAllSkillsQuery,
} from "@/services/api/fetchApi";
import { formatTimeRange } from "@/utils/formatTimeRange";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../Button";
import { CheckBoard } from "../CheckBoard";
import { Checkbox } from "../Checkbox";
import { DataInput } from "../DataInput";
import { Radio } from "../Radio";
import styles from "./StepTwoProcessEdit.module.scss";

export function StepTwoProcessEdit({
  handleTogglePage,
  currentProcessData,
  setProcessData,
  setStep,
}: {
  handleTogglePage: (page: number) => void;
  currentProcessData: any;
  setProcessData: (data: any) => void;
  setStep: (step: number) => void;
}) {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(processEditStepTwoSchema),
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
      ...(typeof data.availableForMinors === "boolean" && {
        availableForMinors: data.availableForMinors,
      }),
      ...(data?.availabilities && { availabilities: data.availabilities }),
      ...(data?.schoolings && { schoolings: data.schoolings }),
      ...(data?.skills && { skills: data.skills }),
      ...(data?.benefits && { benefits: data.benefits }),
      ...(data?.type && { type: data.type }),
    });

    handleTogglePage(3);
  }

  return (
    <form
      id="process-edit"
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
              defaultValue={currentProcessData?.availabilities.map(
                (item: any) => ({
                  name: formatTimeRange(item),
                  id: item.id,
                }),
              )}
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
              defaultValue={currentProcessData?.schoolings.map((item: any) => ({
                name: item.schoolingName,
                id: item.id,
              }))}
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
              defaultValue={currentProcessData?.skills.map((item: any) => ({
                name: item.skillText,
                id: item.id,
              }))}
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
              defaultValue={currentProcessData?.benefits.map((item: any) => ({
                name: item.benefitName,
                id: item.id,
              }))}
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
                defaultValue={currentProcessData?.type === "PRESENCIAL"}
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
          name="availableForMinors"
          control={control}
          render={({ field: { onChange } }) => (
            <div className={styles.container__form__checkBox}>
              <Checkbox
                defaultValue={currentProcessData?.availableForMinors}
                iconType="solid"
                value="Processo disponível para menores de 18 anos"
                onChangeCheckbox={value => onChange(value)}
                type="button"
              />
            </div>
          )}
        />
        <div className={styles.container__form__buttons}>
          <Button
            type="button"
            buttonType="default"
            text="Voltar"
            onClick={() => setStep(1)}
          >
            Cancelar
          </Button>
          <Button
            buttonType="primary"
            text="Próximo"
            icon={<ArrowCircleRight />}
            form="process-edit"
          />
        </div>
      </section>
    </form>
  );
}
