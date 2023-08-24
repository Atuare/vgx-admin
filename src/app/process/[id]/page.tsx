"use client";
import {
  fetchApi,
  useDeleteProcessMutation,
  useGetAllProcessQuery,
} from "@/services/api/fetchApi";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./ProcessData.module.scss";

import { Delete, EditSquare, Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import { setProcessEdit } from "@/features/process/processEditSlice";
import { ProcessType } from "@/interfaces/process.interface";

import { DeleteModal } from "@/components/DeleteModal";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export default function ProcessData() {
  const { data, isSuccess } = useGetAllProcessQuery({
    page: 1,
    size: 1,
  });
  const [deleteProcess] = useDeleteProcessMutation();
  const dispatch = useDispatch();
  const [process, setProcess] = useState<ProcessType>();
  const [value, setValue] = useState<string>("");
  const params = useParams();
  const { push } = useRouter();

  function handleInputValue(value: string) {
    setValue(value);
  }

  function handleDeleteProcess() {
    const processId = Array.from(params.id).join("");

    deleteProcess({ id: processId }).then(() => {
      location.replace("/process");
    });
  }

  async function handleGetProcess() {
    const totalCount = data.totalCount;

    const { data: processesData } = await dispatch<any>(
      fetchApi.endpoints.getAllProcess.initiate({ page: 1, size: totalCount }),
    );

    processesData.processes.map((process: ProcessType) => {
      if (String(process.id) === params.id) {
        setProcess(process);
        dispatch(setProcessEdit(process));
      }
    });
  }

  function handleEditProcess() {
    push(`/process/${process?.id}/edit`);
  }

  useEffect(() => {
    if (isSuccess) {
      handleGetProcess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  if (!process) return;

  return (
    <div className={styles.process}>
      <section className={styles.process__process}>
        <div>
          <h1>{process?.role.roleText}</h1>
          <div className={styles.buttonContainer}>
            <DeleteModal
              handleOnDelete={handleDeleteProcess}
              name="este processo"
            >
              <Button
                text="Excluir processo"
                buttonType="error"
                icon={<Delete />}
              />
            </DeleteModal>
            <Button
              text="Editar"
              buttonType="secondary"
              icon={<EditSquare />}
              onClick={handleEditProcess}
            />
          </div>
        </div>
        <p>
          Criado em {dayjs(process?.createdAt).format("DD/MM/YYYY HH:mm:ss")}
        </p>
      </section>

      <section className={styles.process__data}>
        <DataInput
          name="Unidade/Site"
          value={process.unit.unitName}
          width="224px"
        />
        <DataInput name="Cargo" value={process.role.roleText} width="399px" />
        <DataInput
          name="Processo para"
          value="Teste de unidade"
          width="192px"
        />
        <DataInput
          name="Tipo de processo*"
          value={process.type}
          width="192px"
        />
        <DataInput
          name="Data início*"
          value={dayjs(process.startDate).utc().format("DD/MM/YYYY")}
          width="192px"
        />
        <DataInput
          name="Inscrição até"
          value={dayjs(process.endDate).utc().format("DD/MM/YYYY")}
          width="192px"
        />
        <DataInput
          name="Lim. Candidaturas*"
          value={process.limitCandidates.toString()}
          width="192px"
        />
        <DataInput
          name="Solicitar Currículo*"
          value={process.requestCv}
          width="399px"
        />
        <DataInput name="Banner vaga" value={process.banner} width="224px" />
      </section>

      <section className={styles.process__actions}>
        <h1>Candidaturas</h1>
        <div>
          <Button
            text="Exportar dados"
            buttonType="secondary"
            icon={<SystemUpdate />}
          />
          <SearchInput handleChangeValue={handleInputValue} icon={<Search />} />
        </div>
      </section>
    </div>
  );
}

function DataInput({
  name,
  value,
  width,
}: {
  name: string;
  value: string | boolean;
  width: string;
}) {
  return (
    <div className={styles.dataInput}>
      <label htmlFor={name}>{name}</label>
      {typeof value === "string" ? (
        <input type="text" value={value} id={name} disabled />
      ) : (
        <div className={styles.radio}>
          {[true, false].map(item => (
            <div
              className={styles.radio__item}
              key={crypto.randomUUID()}
              data-state={item === value ? "active" : "inactive"}
            >
              <div className={styles.radio__thumb}>
                <div />
              </div>
              {item ? "Sim" : "Não"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
