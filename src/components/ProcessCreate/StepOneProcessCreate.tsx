import { ArrowCircleRight } from "@/assets/Icons";
import { processCreateStepOneSchema } from "@/schemas/processCreateSchema";
import {
  useGetAllRolesQuery,
  useGetAllUnitsQuery,
} from "@/services/api/fetchApi";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../Button";
import { DataInput } from "../DataInput";
import { FileInput } from "../FileInput";
import { NumberInput } from "../NumberInput";
import { Radio } from "../Radio";
import { Select } from "../Select";
import { TipTap } from "../TipTap";
import styles from "./StepOneProcessCreate.module.scss";

export function StepOneProcessCreate({
  handleTogglePage,
  setProcessData,
  currentProcessData,
}: {
  handleTogglePage: (page: number) => void;
  setProcessData: (data: any) => void;
  currentProcessData: any;
}) {
  const { back } = useRouter();
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(processCreateStepOneSchema),
    defaultValues: {
      ...currentProcessData,
    },
  });

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

  function onSubmit(data: any) {
    setProcessData({
      ...currentProcessData,
      unit: data.unit,
      role: data.role,
      curriculum: data.requestCv,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      limitCandidates: data.limitCandidates,
      file: data.banner,
      observations: data.observations,
      registrationCompletionMessage: data.registrationCompletionMessage,
    });
    handleTogglePage(2);
  }

  return (
    <form
      id="process-create"
      onSubmit={handleSubmit(onSubmit)}
      className={styles.container}
    >
      <section className={styles.container__form}>
        <div className={styles.container__form__first}>
          <Controller
            name="unit"
            control={control}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <DataInput
                name="Unidade/Site"
                required
                width="296px"
                error={error?.message}
              >
                <Select
                  placeholder="Selecione os locais"
                  options={unitOptions}
                  onChange={onChange}
                  defaultValue={currentProcessData?.unit?.name}
                />
              </DataInput>
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <DataInput
                name="Cargo"
                required
                width="448px"
                error={error?.message}
              >
                <Select
                  placeholder="Selecione"
                  options={roleOptions}
                  onChange={onChange}
                  defaultValue={currentProcessData?.role?.name}
                />
              </DataInput>
            )}
          />

          <Controller
            name="requestCv"
            control={control}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <DataInput name="Solicitar currículo" width="264px" required>
                <Radio
                  onChange={onChange}
                  defaultValue={currentProcessData?.curriculum}
                />
              </DataInput>
            )}
          />
        </div>

        <div className={styles.container__form__second}>
          <Controller
            name="startDate"
            control={control}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <DataInput
                name="Data inicial"
                width="224px"
                required
                error={error?.message}
              >
                <input
                  type="date"
                  onChange={onChange}
                  defaultValue={
                    currentProcessData?.startDate &&
                    dayjs(currentProcessData?.startDate).format("YYYY-MM-DD")
                  }
                />
              </DataInput>
            )}
          />

          <Controller
            name="endDate"
            control={control}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <DataInput
                name="Inscrições até"
                width="224px"
                error={error?.message}
              >
                <input
                  type="date"
                  onChange={onChange}
                  defaultValue={
                    currentProcessData?.endDate &&
                    dayjs(currentProcessData?.endDate).format("YYYY-MM-DD")
                  }
                />
              </DataInput>
            )}
          />

          <Controller
            name="limitCandidates"
            control={control}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <DataInput
                name="Limite de candidaturas"
                width="224px"
                error={error?.message}
              >
                <NumberInput
                  onChange={onChange}
                  defaultValue={currentProcessData?.limitCandidates ?? 1}
                />
              </DataInput>
            )}
          />

          <Controller
            name="banner"
            control={control}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <DataInput
                name="Upload banner vaga"
                width="301px"
                error={error?.message}
                required
              >
                <FileInput
                  onChange={onChange}
                  defaultFile={currentProcessData?.file}
                />
              </DataInput>
            )}
          />
        </div>
      </section>
      <div className={styles.container__editor}>
        <h1>
          Observações <span>(opcional)</span>
        </h1>
        <Controller
          name="observations"
          control={control}
          render={({ field: { onChange } }) => (
            <TipTap
              getContentFromEditor={content =>
                onChange(JSON.stringify(content))
              }
              content={
                currentProcessData?.observations &&
                JSON.parse(currentProcessData?.observations)
              }
            />
          )}
        />
      </div>

      <div className={styles.container__editor}>
        <h1>
          Mensagem exibida ao final do cadastro <span>(opcional)</span>
        </h1>
        <Controller
          name="registrationCompletionMessage"
          control={control}
          render={({ field: { onChange } }) => (
            <TipTap
              getContentFromEditor={content =>
                onChange(JSON.stringify(content))
              }
              content={
                currentProcessData?.registrationCompletionMessage &&
                JSON.parse(currentProcessData?.registrationCompletionMessage)
              }
            />
          )}
        />
      </div>

      <div className={styles.container__buttons}>
        <Button
          type="button"
          buttonType="default"
          text="Cancelar"
          onClick={() => back()}
        />
        <Button
          buttonType="primary"
          text="Próximo"
          icon={<ArrowCircleRight />}
          form="process-create"
        />
      </div>
    </form>
  );
}
