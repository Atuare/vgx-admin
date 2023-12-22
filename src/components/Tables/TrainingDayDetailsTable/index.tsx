import { ScheduleSend } from "@/assets/Icons";
import { IconButton } from "@/components/IconButton";
import { InputContainer } from "@/components/Modals/DataModal/components/InputContainer";
import { ReleaseAssessmentModal } from "@/components/Modals/ReleaseAssessment";
import { DataTable } from "@/components/Table";
import { useTableParams } from "@/hooks/useTableParams";
import { CandidacyType } from "@/interfaces/candidacy.interface";
import { TrainingType } from "@/interfaces/training.interface";
import {
  useGetTrainingByIdQuery,
  useUpdateAssessmentMutation,
} from "@/services/api/fetchApi";
import { Toast } from "@/utils/toast";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter, useSearchParams } from "next/navigation";
import { RefObject, forwardRef, useEffect, useState } from "react";
import { Checkbox } from "../../Checkbox";
import styles from "./TrainingDayDetailsTable.module.scss";
dayjs.extend(utc);

interface TrainingDayDetailsTableProps {
  trainingId: string;
  trainingDay: number;
  globalFilter?: string;
  tableRef?: RefObject<HTMLButtonElement>;
}

const defaultTableSize = 5;

// eslint-disable-next-line react/display-name
export const TrainingDayDetailsTable = forwardRef<
  HTMLButtonElement,
  TrainingDayDetailsTableProps
>((props, ref) => {
  const [table, setTable] = useState<Table<any>>();
  const [training, setTraining] = useState<TrainingType>();

  const { get } = useSearchParams();

  const [currentPage, setCurrentPage] = useState<number>(
    get("page") ? Number(get("page")) : 1,
  );

  const { push } = useRouter();
  const { setParams } = useTableParams();

  const { data, isSuccess, isFetching, refetch } = useGetTrainingByIdQuery({
    id: props.trainingId,
  });
  const [updateAssessment] = useUpdateAssessmentMutation();

  const handleTogglePage = async (page: number) => {
    setCurrentPage(page + 1);
  };

  const releaseAssessmentForCandidacies = async () => {
    const trainingAssessment = training?.trainingAssessments.find(
      trainingAssessment =>
        trainingAssessment.trainingDay.dayNumber === props.trainingDay, // last tested: 3
    );

    try {
      if (trainingAssessment) {
        await updateAssessment({
          id: trainingAssessment.id,
          availableForCandidacies: true,
        });
        Toast("success", "Avaliação liberada com sucesso!");
      }
    } catch {
      Toast("error", "Houve um erro ao tentar liberar a avaliação");
    }
  };

  const columnHelper = createColumnHelper<CandidacyType>();

  const columns = [
    columnHelper.accessor("id", {
      id: "select",
      header: "",
      cell: ({ row }) => (
        <Checkbox
          {...{
            isActive: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            onChangeCheckbox: () => row?.toggleSelected(),
          }}
          iconType="solid"
          style={{ padding: 0, transform: "translateY(-2px)" }}
        />
      ),
    }),
    columnHelper.accessor("candidate.name", {
      header: "Nome",
      cell: row => {
        return <div>{row.getValue()}</div>;
      },
    }),
    columnHelper.accessor("trainingParticipantDays", {
      header: "Presença",
      id: "presence",
      cell: row => {
        const trainingParticipantDayPresence = row
          .getValue()
          .find(
            trainingParticipantDay =>
              trainingParticipantDay.trainingDay.dayNumber ===
              props.trainingDay,
          )?.presence;

        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Checkbox
              iconType="solid"
              isActive={trainingParticipantDayPresence}
              disabled
              style={{ width: "auto" }}
            />
          </div>
        );
      },
    }),
    columnHelper.accessor("trainingParticipantDays", {
      header: "Ausência",
      id: "absent",
      cell: row => {
        const trainingParticipantDayAbsent = row
          .getValue()
          .find(
            trainingParticipantDay =>
              trainingParticipantDay.trainingDay.dayNumber ===
              props.trainingDay,
          )?.absent;

        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Checkbox
              iconType="solid"
              isActive={trainingParticipantDayAbsent}
              disabled
              style={{ width: "auto" }}
            />
          </div>
        );
      },
    }),
    columnHelper.accessor("id", {
      header: () => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          Avaliação{" "}
          <ReleaseAssessmentModal
            handleOnRelease={() => releaseAssessmentForCandidacies()}
            name={String(props.trainingDay)}
          >
            <IconButton icon={<ScheduleSend />} style={{ display: "flex" }} />
          </ReleaseAssessmentModal>
        </div>
      ),
      cell: row => {
        const candidacyId = row.getValue();

        const trainingAssessment = training?.trainingAssessments.find(
          trainingAssessment => trainingAssessment.trainingDay.dayNumber === 3, // last tested: 3
        );

        const grade = trainingAssessment?.trainingAssessmentGrades?.find(
          trainingAssessmentGrade =>
            trainingAssessmentGrade?.candidacy?.id === candidacyId,
        )?.candidacy.grade;

        return <div>{grade || "Não há"}</div>;
      },
    }),
    columnHelper.accessor("trainingParticipantDays", {
      header: "Observação",
      id: "observation",
      cell: row => {
        const trainingParticipantDayObservation = row
          .getValue()
          .find(
            trainingParticipantDay =>
              trainingParticipantDay.trainingDay.dayNumber ===
              props.trainingDay,
          )?.observation; // TODO: Possibility to change observation

        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <InputContainer htmlFor="observation" height={40}>
              <input
                type="text"
                id="observation"
                defaultValue={trainingParticipantDayObservation}
              />
            </InputContainer>
          </div>
        );
      },
    }),
  ];

  useEffect(() => {
    setParams("page", String(currentPage));
    refetch();
  }, [currentPage]);

  useEffect(() => {
    if (isSuccess) {
      setTraining(data.data);
    }
  }, [isSuccess, isFetching]);

  useEffect(() => {
    if (training) {
      // getAllFilters();
    }
  }, [training]);

  if (!training) return null;

  return (
    <section className={styles.trainingDayDetails__list}>
      <DataTable
        data={training.candidacies}
        size={5}
        columns={columns}
        setTable={setTable}
        ref={ref}
        defaultTableSize={defaultTableSize}
        currentPage={currentPage}
        handleTogglePage={handleTogglePage}
        globalFilterValue={props.globalFilter}
        tableName="Dia Treinamento"
      />
    </section>
  );
});
