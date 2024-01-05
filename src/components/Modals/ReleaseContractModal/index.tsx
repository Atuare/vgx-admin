import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { Select } from "@/components/Select";
import { IContract } from "@/interfaces/contract.interface";
import { useGetAllContractsQuery } from "@/services/api/fetchApi";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { ReactNode, useEffect, useState } from "react";
import styles from "./ReleaseContractModal.module.scss";

export function ReleaseContractModal({
  children,
  handleOnSave,
  onChangeSendMethods,
  onChangeContract,
  text,
  buttonText,
  icon,
}: {
  children: ReactNode;
  handleOnSave: () => void;
  onChangeSendMethods: (sendMethods: string[]) => void;
  onChangeContract: (contract: IContract) => void;
  text: string;
  buttonText: string;
  icon: ReactNode;
}) {
  const [contracts, setContracts] = useState<{ name: string; id: string }[]>(
    [],
  );
  const [sendMethods, setSendMethods] = useState<string[]>([]);

  const { data: documentsData, isSuccess } = useGetAllContractsQuery({
    page: 1,
    size: 99999,
    orderBy: "createdAt",
    direction: "DESC",
  });

  const updateSendMethod = (sendMethod: string) => {
    const methodIncluded = sendMethods?.includes(sendMethod);

    const methods = methodIncluded
      ? sendMethods?.filter(method => method !== sendMethod)
      : [...sendMethods, sendMethod];

    setSendMethods(methods);
  };

  const handleChangeContract = (id: string) => {
    onChangeContract(
      documentsData?.contracts.find((contract: IContract) => contract.id == id),
    );
  };

  useEffect(() => {
    onChangeSendMethods(sendMethods);
  }, [sendMethods]);

  useEffect(() => {
    if (isSuccess) {
      setContracts(
        documentsData?.contracts.map((contract: IContract) => ({
          name: contract.name,
          id: contract.id,
        })),
      );
    }
  }, [isSuccess]);

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <span onClick={() => setSendMethods([])}>{children}</span>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={styles.modal__overlay} />
        <AlertDialog.Content className={styles.modal__content}>
          <AlertDialog.Title className={styles.modal__title}>
            {text}
          </AlertDialog.Title>
          <div className={styles.modal__selects}>
            <Select
              options={contracts}
              placeholder="Selecione"
              onChange={({ id }) => handleChangeContract(id)}
            />
          </div>
          <div className={styles.modal__checkboxes}>
            <Checkbox
              iconType="solid"
              value="WhatsApp"
              onChangeCheckbox={() => updateSendMethod("whatsapp")}
            />
            <Checkbox
              iconType="solid"
              value="E-mail"
              onChangeCheckbox={() => updateSendMethod("email")}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              padding: 10,
            }}
          >
            <AlertDialog.Cancel asChild>
              <span>
                <Button text="Cancelar" buttonType="default" />
              </span>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild onClick={handleOnSave}>
              <span>
                <Button text={buttonText} buttonType="primary" icon={icon} />
              </span>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
