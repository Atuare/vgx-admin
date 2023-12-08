import {
  ICreateInterview,
  IGeneral,
} from "@/interfaces/configInterviews.interface";
import { GeneralSchema } from "@/schemas/configInterviewsSchema";
import { useGetAllUnitsQuery } from "@/services/api/fetchApi";
import { convertStringTimeToDate } from "@/utils/dates";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../Button";
import { DataInput } from "../DataInput";
import { Select } from "../Select";
import { TipTap } from "../TipTap";
import styles from "./ConfigInterview.module.scss";

type SelectOptions = {
  name: string;
  id: string;
}[];

interface IGeneralProps {
  handleOnSubmit: (data: Partial<IGeneral>) => void;
  interview?: ICreateInterview;
}

export function General({ handleOnSubmit, interview }: IGeneralProps) {
  const [units, setUnits] = useState<SelectOptions>([]);

  const { push } = useRouter();

  const initialDatesOptions = [
    {
      name: "D+1",
      id: "D+1",
    },
    {
      name: "D+2",
      id: "D+2",
    },
    {
      name: "D+3",
      id: "D+3",
    },
    {
      name: "D+4",
      id: "D+4",
    },
    {
      name: "D+5",
      id: "D+5",
    },
  ];

  const InterviewType = [
    {
      name: "Remoto",
      id: "REMOTE",
    },
    {
      name: "Presencial",
      id: "PERSON",
    },
  ];

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<IGeneral>({
    resolver: yupResolver(GeneralSchema),
  });

  const { data: unitsData, isSuccess: unitsIsSuccess } = useGetAllUnitsQuery({
    page: 1,
    size: 99999,
  });

  const handleSubmitGeneneral = (data: IGeneral) => {
    handleOnSubmit({
      ...data,
      limitTime: convertStringTimeToDate(data.limitTime),
    });
  };

  useEffect(() => {
    if (unitsIsSuccess) {
      const unitsOptions = unitsData.units.map(unit => {
        return {
          name: unit.unitName,
          id: unit.id,
        };
      });

      setUnits(unitsOptions);
    }
  }, [unitsIsSuccess]);

  useEffect(() => {
    if (interview) {
      reset({
        availableDays: interview.availableDays,
        endMessage: `${interview.endMessage}`,
        limitTime: dayjs(interview.limitTime).format("HH:mm"),
        startDate: interview.startDate,
        type: interview.type,
        unitOrSite:
          typeof interview.unitOrSite === "string"
            ? {
                name: interview.unitOrSite,
                id: interview.unitOrSite,
              }
            : interview.unitOrSite,
      });
    }
  }, [interview]);

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(handleSubmitGeneneral)}
    >
      <div className={styles.form__inputs}>
        <Controller
          control={control}
          name="unitOrSite"
          render={({ field: { onChange, value } }) => (
            <DataInput
              name="Unidade/Site"
              required
              error={errors.unitOrSite?.name?.message}
            >
              <Select
                options={units}
                placeholder="Selecione"
                onChange={onChange}
                value={value?.name}
              />
            </DataInput>
          )}
        />

        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <DataInput
              name="Tipo de entrevista"
              required
              error={errors.type?.name?.message}
            >
              <Select
                options={InterviewType}
                placeholder="Selecione"
                onChange={onChange}
                value={value?.name}
              />
            </DataInput>
          )}
        />

        <DataInput
          name="Hora Limite"
          required
          error={errors.limitTime?.message}
        >
          <input type="time" {...register("limitTime")} />
        </DataInput>

        <Controller
          control={control}
          name="startDate"
          render={({ field: { onChange, value } }) => (
            <DataInput
              name="Data Inicial"
              required
              error={errors.startDate?.message}
            >
              <Select
                options={initialDatesOptions}
                placeholder="Selecione"
                onChange={val => onChange(val?.id)}
                value={value}
              />
            </DataInput>
          )}
        />

        <DataInput
          name="Dias Disponíveis"
          required
          error={errors.availableDays?.message}
        >
          <input type="number" {...register("availableDays")} />
        </DataInput>
      </div>
      <Controller
        control={control}
        name="endMessage"
        render={({ field: { onChange } }) => (
          <DataInput
            name="Mensagem final"
            required
            error={errors.endMessage?.message}
          >
            <TipTap
              grayBorder
              getContentFromEditor={content => {
                if (
                  content.content.some(
                    (item: { content: any }) => item?.content,
                  ) &&
                  content.content.some(
                    (item: { content: any[] }) =>
                      item.content?.every(
                        subItem =>
                          subItem.text &&
                          typeof subItem.text === "string" &&
                          subItem.text.trim() !== "",
                      ),
                  )
                ) {
                  onChange(JSON.stringify(content));
                } else {
                  onChange("");
                }
              }}
              content={
                interview?.endMessage && JSON.parse(interview.endMessage)
              }
            />
          </DataInput>
        )}
      />

      <footer className={styles.form__footer}>
        <Button
          buttonType="default"
          text="Cancelar"
          type="button"
          onClick={() => push("/config/interviews")}
        />
        <Button buttonType="primary" text="Próximo" type="submit" />
      </footer>
    </form>
  );
}
