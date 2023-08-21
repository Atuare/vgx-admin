import { TaskAlt } from "@/assets/Icons";
import stylesCheckBoard from "@/components/CheckBoard/CheckBoard.module.scss";
import { StatusEnum } from "@/enums/status.enum";
import { useCreateProcessMutation } from "@/services/api/fetchApi";
import { formatDateTime } from "@/utils/dates";
import { TextStyleExtended } from "@/utils/fontsize";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRouter } from "next/navigation";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { DataInput } from "../DataInput";
import { FileInput } from "../FileInput";
import { Radio } from "../Radio";
import stylesStepOne from "./StepOneProcessCreate.module.scss";
import styles from "./StepThreeProcessCreate.module.scss";
import stylesStepTwo from "./StepTwoProcessCreate.module.scss";

export function StepThreeProcessCreate({
  processData,
  setStep,
}: {
  processData: any;
  setStep: (step: number) => void;
}) {
  const { back } = useRouter();
  const [createProcess] = useCreateProcessMutation();

  const observationsEditor = useEditor({
    extensions: [
      StarterKit,
      Color,
      Underline,
      FontFamily,
      Link,
      TextStyleExtended,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image,
    ],
    content: processData?.observations && JSON.parse(processData?.observations),
    editable: false,
  });

  const registrationCompletionMessageEditor = useEditor({
    extensions: [
      StarterKit,
      Color,
      Underline,
      FontFamily,
      Link,
      TextStyleExtended,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image,
    ],
    content:
      processData?.registrationCompletionMessage &&
      JSON.parse(processData?.registrationCompletionMessage),
    editable: false,
  });

  function handleCreateProcess() {
    const createProcessData = {
      status: StatusEnum.ATIVO,
      type: processData?.type,
      unitId: processData?.unit?.id,
      roleId: processData?.role?.id,
      skillsId: processData?.skills?.map((skill: any) => skill.id),
      availabilitiesId: processData?.availabilities?.map(
        (availability: any) => availability.id,
      ),
      schoolingsId: processData?.schoolings?.map(
        (schooling: any) => schooling.id,
      ),
      benefitsId: processData?.benefits?.map((benefit: any) => benefit.id),
      requestCv: processData?.curriculum,
      availableForMinors: processData?.availableForMinors,
      startDate: processData?.startDate,
      endDate: processData?.endDate,
      limitCandidates: processData?.limitCandidates,
      ...(processData?.observations && {
        observations: processData?.observations,
      }),
      ...(processData?.registrationCompletionMessage && {
        registrationCompletionMessage:
          processData?.registrationCompletionMessage,
      }),
      file: processData?.file,
    };

    createProcess(createProcessData).then(() => {
      location.replace("/process");
    });
  }

  return (
    <div className={styles.container}>
      <span className={styles.container__title}>Dados do processo</span>
      <div className={stylesStepOne.container}>
        <section className={stylesStepOne.container__form}>
          <div className={stylesStepOne.container__form__first}>
            <DataInput name="Unidade/Site" width="296px" required>
              <input type="text" value={processData?.unit?.name} disabled />
            </DataInput>
            <DataInput name="Cargo" width="448px" required>
              <input type="text" value={processData?.role?.name} disabled />
            </DataInput>
            <DataInput name="Solicitar currículo" width="264px" required>
              <Radio
                defaultValue={processData?.curriculum}
                onChange={() => {}}
                disabled
              />
            </DataInput>
          </div>

          <div className={stylesStepOne.container__form__second}>
            <DataInput name="Data inicial" width="224px" required>
              <input
                type="date"
                defaultValue={formatDateTime(processData?.startDate)}
                onChange={() => {}}
                disabled
              />
            </DataInput>
            <DataInput name="Inscrições até" width="224px" required>
              <input
                type="date"
                defaultValue={formatDateTime(processData?.endDate)}
                onChange={() => {}}
                disabled
              />
            </DataInput>
            <DataInput name="Limite de candidaturas" width="224px" required>
              <input
                type="number"
                disabled
                value={processData?.limitCandidates}
              />
            </DataInput>
            <DataInput name="Upload banner vaga" width="301px" required>
              <FileInput
                onChange={() => {}}
                defaultFile={processData?.file}
                disabled
              />
            </DataInput>
          </div>
        </section>

        <DataInput name="Observações" required>
          <EditorContent
            editor={observationsEditor}
            className={styles.container__editorContainer}
          />
        </DataInput>
        <DataInput name="Mensagem exibida ao final do cadastro" required>
          <EditorContent
            editor={registrationCompletionMessageEditor}
            className={styles.container__editorContainer}
          />
        </DataInput>
      </div>
      <span className={styles.container__title}>
        Disponibilidade, Requisitos e Benefícios
      </span>

      <div className={stylesStepTwo.container}>
        <section className={stylesStepTwo.container__form}>
          <CheckBoardItemsPreview
            title="Disponibilidade de horários / Turnos"
            items={processData?.availabilities}
          />
          <CheckBoardItemsPreview
            title="Escolaridade"
            items={processData?.schoolings}
          />
          <CheckBoardItemsPreview
            title="Habilidades"
            items={processData?.skills}
          />
          <CheckBoardItemsPreview
            title="Benefícios"
            items={processData?.benefits}
          />
          <DataInput name="Tipo" width="328px" required>
            <Radio
              defaultValue={processData?.type === "PRESENCIAL" ? true : false}
              options={["Presencial", "Remoto"]}
              onChange={() => {}}
              disabled
            />
          </DataInput>
          <div className={stylesStepTwo.container__form__checkBox}>
            <Checkbox
              iconType="solid"
              isActive={processData?.availableForMinors}
              value="Processo disponível para menores de 18 anos"
              disabled
              type="button"
            />
          </div>
        </section>
      </div>
      <div className={stylesStepOne.container__buttons}>
        <Button buttonType="default" text="Voltar" onClick={() => setStep(2)} />
        <Button
          buttonType="primary"
          text="Finalizar"
          icon={<TaskAlt />}
          onClick={handleCreateProcess}
        />
      </div>
    </div>
  );
}

interface ICheckBoardHeader {
  title: string;
  items: { name: string; id: string }[];
}

export function CheckBoardItemsPreview({ title, items }: ICheckBoardHeader) {
  return (
    <div className={stylesCheckBoard.checkBoard}>
      <div className={stylesCheckBoard.checkBoard__header}>
        <p>{title}</p>
      </div>
      <div
        className={stylesCheckBoard.checkBoard__body}
        style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
      >
        <div
          className={stylesCheckBoard.checkBoard__body__itemPreview}
          style={{ border: 0 }}
        >
          {items.map(item => (
            <div key={item.id}>
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
