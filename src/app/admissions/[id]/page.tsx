"use client";
import {
  DonutLarge,
  EditSquare,
  Search,
  SystemUpdate,
  TaskAlt,
} from "@/assets/Icons";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import FlatText from "@/components/FlatText";
import { ReleaseContractModal } from "@/components/Modals/ReleaseContractModal";
import { SearchInput } from "@/components/SearchInput";
import { DataTable } from "@/components/Table";
import { FilterButton } from "@/components/Table/Filters/FilterButton";
import {
  AdmissionContractStatusEnum,
  AdmissionsStatusEnum,
} from "@/enums/status.enum";
import { useTableParams } from "@/hooks/useTableParams";
import {
  IAdmission,
  IAdmissionCandidate,
} from "@/interfaces/admissions.interface";
import { ICandidate } from "@/interfaces/candidate.interface";
import { IContract } from "@/interfaces/contract.interface";
import {
  useCreateSignatureDocumentMutation,
  useCreateSignatureLinkMutation,
  useCreateSignatureSignerMutation,
  useGetAdmissionQuery,
  useGetAllUnitsQuery,
} from "@/services/api/fetchApi";
import { admissionsStatus } from "@/utils/admissions";
import { formatCpf } from "@/utils/formatCpf";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatRG } from "@/utils/formatRg";
import { formatTimeRange } from "@/utils/formatTimeRange";
import { formatWhatsappNumber } from "@/utils/phoneFormating";
import { getSignatureDocument } from "@/utils/signature";
import { Toast } from "@/utils/toast";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import styles from "./Admission.module.scss";
dayjs.extend(utc);

const defaultTableSize = 5;

export default function AdmissionClass() {
  const [admission, setAdmission] = useState<IAdmission>();
  const [candidates, setCandidates] = useState<IAdmissionCandidate[]>();
  const [totalCount, setTotalCount] = useState<number>();
  const [unitsOptions, setUnitsOptions] = useState<string[]>([]);
  const [table, setTable] = useState<Table<any>>();
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [contract, setContract] = useState<IContract>();
  const [contractSendMethods, setContractSendMethods] = useState<string>("");

  const pathname = usePathname();
  const { get } = useSearchParams();
  const { setParams } = useTableParams();
  const { push } = useRouter();

  const [currentPage, setCurrentPage] = useState<number>(
    get("page") ? Number(get("page")) : 1,
  );

  const { data, isSuccess, isFetching, refetch } = useGetAdmissionQuery({
    admissionId: pathname.split("/")[2],
    page: currentPage,
    size: defaultTableSize,
  });

  const { data: units, isSuccess: unitsSuccess } = useGetAllUnitsQuery({
    page: 1,
    size: 9999,
  });

  const [createSignatureDocument] = useCreateSignatureDocumentMutation();
  const [createSignatureSigner] = useCreateSignatureSignerMutation();
  const [createSignatureLink] = useCreateSignatureLinkMutation();

  const handleTogglePage = async (page: number) => {
    setCurrentPage(page + 1);
  };

  const handleInputValue = (value: string) => {
    setGlobalFilter(value);
  };

  const handleGetSignatureDocument = async (id: string) => {
    const document = await getSignatureDocument(id);

    return document;
  };

  const handleCreateSigner = async (candidate: ICandidate) => {
    try {
      const res = await createSignatureSigner({
        email: candidate.email,
        phone: candidate.whatsapp,
        name: candidate.name,
        auths: [contractSendMethods],
        document: candidate.cpf,
        birthday: candidate.birthdate,
      });

      return (res as any).data.data;
    } catch (err) {
      Toast("error", "Houve um erro tentando criar um assinante");
    }
  };

  const handleCreateContract = async (contract: IContract) => {
    try {
      const res = await createSignatureDocument({
        path: `/${contract.name}-${contract.id}.pdf`,
        content: contract.document,
        timeout: new Date(new Date().setDate(new Date().getDate() + 90)),
        selfless: true,
        refusal: true,
      });

      return (res as any).data.data;
    } catch (err) {
      Toast("error", "Houve um erro tentando criar um documento de assinatura");
    }
  };

  const handleCreateSignatureLink = async (
    signerData: any,
    documentData: any,
    admissionResult: any,
  ) => {
    try {
      await createSignatureLink({
        admissionResult: { ...admissionResult, document: contract?.document },
        documentKey: documentData.key,
        signerKey: signerData.key,
        refusable: true,
        message: "Há um contrato te aguardando",
      });
    } catch (err) {
      Toast("error", "Houve um erro tentando criar um link de assinatura");
    }
  };

  const handleSendContract = async (
    candidate: ICandidate,
    admissionResult: any,
  ) => {
    if (!contract) return;

    const signerData = await handleCreateSigner(candidate);
    const documentData = await handleCreateContract(contract);

    await handleCreateSignatureLink(signerData, documentData, admissionResult);
  };

  const handleReleaseContract = () => {
    const rows = table?.getSelectedRowModel().flatRows.map(row => row.original);
    const candidates = (rows?.map(row => row.candidacy.candidate) ||
      []) as ICandidate[];

    if (!contract) {
      return Toast("error", "Selecione um contrato");
    }

    if (rows && rows.length > 0) {
      Promise.all(
        candidates.map(async (candidate, i) => {
          return await handleSendContract(candidate, rows[i]);
        }),
      )
        .then(() => {
          Toast("success", "Contratos liberados com sucesso");
          table?.resetRowSelection();
          refetch();
        })
        .catch(() => {
          Toast("error", "Erro ao liberar contratos");
        });
    } else {
      Toast("error", "Selecione ao menos um candidato para liberar contrato");
    }
  };

  const handleOpenDocument = async (documentKey: string, e: any) => {
    e.preventDefault();

    const document = (await handleGetSignatureDocument(documentKey))?.data;

    const openInNewTab = (url: string) => {
      window.open(url, "_blank", "noreferrer");
    };

    if (document?.downloads?.signed_file_url) {
      openInNewTab(document.downloads.signed_file_url);
    } else if (document?.downloads?.original_file_url) {
      openInNewTab(document?.downloads?.original_file_url);
    }
  };

  const columnHelper = createColumnHelper<IAdmissionCandidate>();
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
    columnHelper.accessor("candidacy.candidate.name", {
      header: "Nome",
      cell: row => <div style={{ width: 256 }}>{row.getValue()}</div>,
    }),
    columnHelper.accessor(value => formatCpf(value.candidacy?.candidate?.cpf), {
      header: "CPF",
      cell: row => <div style={{ width: 144 }}>{row.getValue() ?? "-"}</div>,
    }),
    columnHelper.accessor(
      value => formatRG(value.candidacy?.candidate?.documents?.identity?.rg),
      {
        header: "RG",
        cell: row => (
          <div style={{ width: 128 }}>
            {formatRG(row.getValue() ?? "-") ?? "-"}
          </div>
        ),
      },
    ),
    columnHelper.accessor(
      value =>
        dayjs(value.candidacy?.candidate?.birthdate)
          .utc()
          .format("DD/MM/YYYY"),
      {
        header: "Data de nascimento",
        cell: row => <div style={{ width: 144 }}>{row.getValue() ?? "-"}</div>,
      },
    ),
    columnHelper.accessor(
      value => formatWhatsappNumber(value.candidacy?.candidate?.phone),
      {
        header: "Telefone",
        cell: row => (
          <div style={{ width: 144 }}>
            {formatWhatsappNumber(row.getValue() ?? "") ?? "-"}
          </div>
        ),
      },
    ),

    columnHelper.accessor("candidacy.process.role.roleText", {
      header: "Função",
      cell: row => <div style={{ width: 144 }}>{row.getValue()}</div>,
    }),
    columnHelper.accessor("candidacy.process.unit.unitName", {
      header: () => (
        <FilterButton
          title="Unidade/Site"
          table={table}
          options={unitsOptions}
          column="unit_unitName"
        />
      ),
      cell: row => {
        return <div style={{ width: 152 }}>{row.getValue()}</div>;
      },
      filterFn: (row, id, value) => {
        return value.length !== 0 ? value.includes(row.getValue(id)) : true;
      },
    }),
    columnHelper.accessor(
      value =>
        value.candidacy?.candidate?.complementaryInfo?.transportVoucher
          ? "SIM"
          : "NÃO",
      {
        header: "Optante VT",
        cell: row => (
          <div style={{ width: 144 }}>{row.getValue() ? "SIM" : "NÃO"}</div>
        ),
      },
    ),
    columnHelper.accessor(
      value => `${formatTimeRange(value.candidacy?.availability)}`,
      {
        header: "Disponibilidade",
        cell: row => (
          <div style={{ width: 180, margin: "0 auto" }}>
            {row.getValue() ?? "-"}
          </div>
        ),
      },
    ),
    columnHelper.accessor(
      value =>
        formatCurrency(
          Number(
            value.candidacy?.candidate?.complementaryInfo?.transportTaxGoing ??
              0,
          ),
        ),
      {
        header: "Tarifa trecho",
        cell: row => <div style={{ width: 144 }}>{row.getValue() ?? "-"}</div>,
      },
    ),
    columnHelper.accessor(
      value =>
        formatCurrency(
          Number(
            value.candidacy?.candidate?.complementaryInfo?.transportTaxReturn ??
              0,
          ),
        ),
      {
        header: "Tarifa integração",
        cell: row => <div style={{ width: 144 }}>{row.getValue()}</div>,
      },
    ),
    columnHelper.accessor(
      value =>
        formatCurrency(
          Number(
            value.candidacy?.candidate?.complementaryInfo?.transportTaxDaily ??
              0,
          ),
        ),
      {
        header: "Tarifa dia",
        cell: row => <div style={{ width: 144 }}>{row.getValue()}</div>,
      },
    ),
    columnHelper.accessor(
      ({ contractStatus }) => {
        const accessor =
          AdmissionContractStatusEnum[
            contractStatus as keyof typeof AdmissionContractStatusEnum
          ];
        return accessor;
      },
      {
        id: "contractStatus",
        header: () => (
          <FilterButton
            title="Status"
            table={table}
            column="contractStatus"
            options={admissionsStatus}
          />
        ),
        cell: row => {
          const value = row.getValue().replace(/\s/g, "");

          const status =
            AdmissionContractStatusEnum[
              String(value) as keyof typeof AdmissionContractStatusEnum
            ];

          return (
            <div style={{ width: 184 }}>
              <FlatText text={status} type={status} />
            </div>
          );
        },
        filterFn: (row: any, id: string, value: string) => {
          const status: { [key: string]: string } = {
            PENDENTE: "Pendente",
            ASSINADO: "Assinado",
            NAOASSINADO: "Não Assinado",
          };

          const rowValue =
            status[row.getValue(id).replace(/\s/g, "") as keyof typeof status];
          return value.length !== 0 ? value.includes(rowValue) : true;
        },
      },
    ),
    columnHelper.accessor("document", {
      header: "Documento",
      cell: async row => {
        const documentKey = row.row.original.documentKey;

        if (!documentKey) {
          return (
            <div style={{ width: 180 }}>
              <p style={{ fontSize: 14, fontWeight: 400 }}>
                Não há documento liberado
              </p>
            </div>
          );
        }

        // TODO: document visualization

        return (
          <div style={{ width: 180 }}>
            {true ? (
              <a
                style={{ fontSize: 14, fontWeight: 400 }}
                href="https://www.clicksign.com/"
                target="_blank"
                onClick={async e => await handleOpenDocument(documentKey, e)}
              >
                Acessar documento
              </a>
            ) : (
              <></>
            )}
          </div>
        );
      },
    }),
  ];

  const downloadTableExcelHandler = () => {
    const selectedRows = table
      ?.getSelectedRowModel()
      .flatRows.map(row => row.original);

    const columnHeaders = [
      "Nome",
      "CPF",
      "RG",
      "Data de nascimento",
      "Telefone",
      "Função",
      "Unidade/Site",
      "Optante VT",
      "Disponibilidade",
      "Tarifa trecho",
      "Tarifa integração",
      "Tarifa diária",
      "Status",
    ];

    if (selectedRows && selectedRows.length > 0) {
      const excelData = selectedRows.map(row => ({
        name: row.candidacy.candidate.name ?? "",
        cpf: formatCpf(row.candidacy.candidate.cpf) ?? "",
        rg: formatRG(row.candidacy.candidate.documents.identity.rg) ?? "",
        dateofbirth:
          dayjs(row.candidacy.candidate.birthdate).utc().format("DD/MM/YYYY") ??
          "",
        phone: formatWhatsappNumber(row.candidacy.candidate.phone) ?? "",
        role: row.candidacy.process.role.roleText ?? "",
        unit: row.candidacy.process.unit.unitName ?? "",
        optedforvt: row.candidacy.candidate.complementaryInfo.transportVoucher
          ? "SIM"
          : "NÃO" ?? "",
        availability: formatTimeRange(row.candidacy.availability) ?? "",
        transportTaxGoing: formatCurrency(
          Number(row.candidacy.candidate.complementaryInfo.transportTaxGoing) ??
            "",
        ),
        transportTaxReturn: formatCurrency(
          Number(
            row.candidacy.candidate.complementaryInfo.transportTaxReturn,
          ) ?? "",
        ),
        transportTaxDaily: formatCurrency(
          Number(row.candidacy.candidate.complementaryInfo.transportTaxDaily) ??
            "",
        ),
        status:
          AdmissionContractStatusEnum[
            row.contractStatus as keyof typeof AdmissionContractStatusEnum
          ] ?? "",
      }));

      downloadExcel({
        fileName: `Turma Admissão`,
        sheet: `Turma Admissão pag. ${currentPage}`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    } else {
      const rows = table?.getRowModel().flatRows.map(row => row.original);

      if (rows && rows.length > 0) {
        const excelData = rows.map(row => ({
          name: row.candidacy.candidate.name ?? "",
          cpf: formatCpf(row.candidacy.candidate.cpf) ?? "",
          rg: formatRG(row.candidacy.candidate.documents.identity.rg) ?? "",
          dateofbirth:
            dayjs(row.candidacy.candidate.birthdate)
              .utc()
              .format("DD/MM/YYYY") ?? "",
          phone: formatWhatsappNumber(row.candidacy.candidate.phone) ?? "",
          role: row.candidacy.process.role.roleText ?? "",
          unit: row.candidacy.process.unit.unitName ?? "",
          optedforvt: row.candidacy.candidate.complementaryInfo.transportVoucher
            ? "SIM"
            : "NÃO" ?? "",
          availability: formatTimeRange(row.candidacy.availability) ?? "",
          transportTaxGoing: formatCurrency(
            Number(
              row.candidacy.candidate.complementaryInfo.transportTaxGoing,
            ) ?? "",
          ),
          transportTaxReturn: formatCurrency(
            Number(
              row.candidacy.candidate.complementaryInfo.transportTaxReturn,
            ) ?? "",
          ),
          transportTaxDaily: formatCurrency(
            Number(
              row.candidacy.candidate.complementaryInfo.transportTaxDaily,
            ) ?? "",
          ),
          status:
            AdmissionContractStatusEnum[
              row.contractStatus as keyof typeof AdmissionContractStatusEnum
            ] ?? "",
        }));

        downloadExcel({
          fileName: `Admissão`,
          sheet: `Admissão pag. ${currentPage}`,
          tablePayload: {
            header: columnHeaders,
            body: excelData,
          },
        });
      }
    }
  };

  useEffect(() => {
    setParams("page", String(currentPage));
    refetch();
  }, [currentPage]);

  useEffect(() => {
    unitsSuccess && setUnitsOptions(units.units.map(unit => unit.unitName));
  }, [unitsSuccess]);

  useEffect(() => {
    if (isSuccess) {
      setAdmission(data.admission);
      setCandidates(data.admissionResult);
      setTotalCount(data.totalCount);
    }
  }, [isSuccess, isFetching]);

  if (!admission) return;

  return (
    <div className={styles.admission}>
      <section className={styles.admission__info}>
        <p>
          Criado em{" "}
          {dayjs(admission.createdAt).utc().format("DD/MM/YYYY HH:mm")}
        </p>
        <p>Por: {admission.examiner}</p>
      </section>
      <section className={styles.admission__actions}>
        <div className={styles.admission__actions__top}>
          <Button
            buttonType="secondary"
            text="Exportar dados"
            icon={<SystemUpdate />}
            onClick={downloadTableExcelHandler}
          />

          <SearchInput handleChangeValue={handleInputValue} icon={<Search />} />

          <div className={styles.admission__actions__top__right}>
            <Status type={admission.status} />
            <Button
              buttonType="secondary"
              text="Editar"
              icon={<EditSquare />}
              onClick={() => push(`/admissions/${admission.id}/edit`)}
            />
          </div>
        </div>
        <div className={styles.buttonContract}>
          <ReleaseContractModal
            buttonText="Permitir acesso"
            handleOnSave={handleReleaseContract}
            onChangeSendMethod={setContractSendMethods}
            onChangeContract={setContract}
            icon={<TaskAlt />}
            text="Liberar contratos para assinatura?"
          >
            <Button
              buttonType="primary"
              text="Liberar contratos para assinatura"
              icon={<TaskAlt />}
            />
          </ReleaseContractModal>
        </div>
      </section>

      {candidates && totalCount && (
        <DataTable
          data={candidates}
          columns={columns}
          currentPage={currentPage}
          defaultTableSize={2}
          handleTogglePage={handleTogglePage}
          setTable={setTable}
          size={totalCount}
          globalFilterValue={globalFilter}
          loading={isFetching}
          scroll
        />
      )}
    </div>
  );
}

function Status({ type }: { type: AdmissionsStatusEnum }) {
  const bgColor = {
    CONCLUIDO: "var(--sucess)",
    EM_ANDAMENTO: "var(--attention)",
    EMANDAMENTO: "var(--attention)",
    "EM ANDAMENTO": "var(--attention)",
    CANCELADO: "var(--error)",
    SUSPENSO: "var(--secondary-7)",
  };

  const status =
    AdmissionsStatusEnum[type as keyof typeof AdmissionsStatusEnum];

  return (
    <div
      className={styles.status}
      style={{ background: bgColor[type as keyof typeof bgColor] }}
    >
      {status}
      <DonutLarge />
    </div>
  );
}
