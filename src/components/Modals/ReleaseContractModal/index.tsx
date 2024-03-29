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
  onChangeSendMethod,
  onChangeContract,
  text,
  buttonText,
  icon,
}: {
  children: ReactNode;
  handleOnSave: () => void;
  onChangeSendMethod: (sendMethod: string) => void;
  onChangeContract: (contract: IContract) => void;
  text: string;
  buttonText: string;
  icon: ReactNode;
}) {
  const [contracts, setContracts] = useState<{ name: string; id: string }[]>(
    [],
  );
  const [sendMethod, setSendMethod] = useState<string>("");

  const { data: documentsData, isSuccess } = useGetAllContractsQuery({
    page: 1,
    size: 99999,
    orderBy: "createdAt",
    direction: "DESC",
  });

  const updateSendMethod = (sendMethod: string) => {
    setSendMethod(sendMethod);
  };

  const handleChangeContract = (id: string) => {
    onChangeContract(
      documentsData?.contracts.find((contract: IContract) => contract.id == id),
    );
  };

  useEffect(() => {
    onChangeSendMethod(sendMethod);
  }, [sendMethod]);

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
        <span onClick={() => setSendMethod("")}>{children}</span>
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
              key={crypto.randomUUID()}
              singleSelect
              isActive={sendMethod === "whatsapp"}
              iconType="solid"
              value="WhatsApp"
              onChangeCheckbox={() => updateSendMethod("whatsapp")}
            />
            <Checkbox
              key={crypto.randomUUID()}
              singleSelect
              isActive={sendMethod === "email"}
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
