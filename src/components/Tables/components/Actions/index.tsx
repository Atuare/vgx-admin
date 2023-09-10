import { Delete } from "@/assets/Icons";
import { IconButton } from "@/components/IconButton";
import { DeleteModal } from "@/components/Modals/DeleteModal";
import { ReactNode } from "react";

interface ActionsProps {
  handleDelete: () => void;
  value: string;
  EditModal: ReactNode;
}

export function Actions({ handleDelete, value, EditModal }: ActionsProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
      }}
    >
      <DeleteModal handleOnDelete={handleDelete} name={value}>
        <IconButton buttonType="delete" icon={<Delete />} />
      </DeleteModal>

      {EditModal}
    </div>
  );
}
