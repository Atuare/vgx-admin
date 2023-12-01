import { ArrowCircleRight } from "@/assets/Icons";
import { processEditStepOneSchema } from "@/schemas/processEditSchema";
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
import styles from "./StepOneProcessEdit.module.scss";

export function StepOneProcessEdit({
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
    resolver: yupResolver(processEditStepOneSchema),
    defaultValues: {
      ...currentProcessData,
      startDate: undefined,
      endDate: undefined,
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
      ...(data?.unit && { unit: data.unit }),
      ...(data?.role && { role: data.role }),
      ...(data?.requestCv && { requestCv: data.requestCv }),
      ...(data?.startDate && {
        startDate: new Date(data.startDate).toISOString(),
      }),
      ...(data?.endDate && { endDate: new Date(data.endDate).toISOString() }),
      ...(data?.limitCandidates && { limitCandidates: data.limitCandidates }),
      ...(data?.banner && { banner: data.banner }),
      ...(data?.observations && { observations: data.observations }),
      ...(data?.registrationCompletionMessage && {
        registrationCompletionMessage: data.registrationCompletionMessage,
      }),
    });

    handleTogglePage(2);
  }

  return (
    <form
      id="process-edit"
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
                  defaultValue={
                    currentProcessData?.unit?.unitName ||
                    currentProcessData?.unit?.name
                  }
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
                  defaultValue={
                    currentProcessData?.role?.roleText ||
                    currentProcessData?.role?.name
                  }
                />
              </DataInput>
            )}
          />

          <Controller
            name="requestCv"
            control={control}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <DataInput
                name="Solicitar currículo"
                width="264px"
                required
                error={error?.message}
              >
                <Radio
                  onChange={onChange}
                  defaultValue={currentProcessData?.requestCv}
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
                optional
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
                optional
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
                  onChange={file => onChange(file)}
                  allowedTypes={["png", "jpeg", "jpg"]}
                  maxSize={5}
                  defaultFile={currentProcessData?.banner}
                  fileName={
                    typeof currentProcessData?.banner === "string"
                      ? currentProcessData?.banner
                      : undefined
                  }
                  width="301px"
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
          form="process-edit"
        />
      </div>
    </form>
  );
}
