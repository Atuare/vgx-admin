import { Delete, EditSquare } from "@/assets/Icons";
import { IconButton } from "@/components/IconButton";
import { DeleteModal } from "@/components/Modals/DeleteModal";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface ActionsProps {
  handleDelete: () => void;
  value: string;
  EditModal?: ReactNode;
  href?: string;
}

export function Actions({
  handleDelete,
  value,
  EditModal,
  href,
}: ActionsProps) {
  const { push } = useRouter();

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

      {EditModal ? (
        EditModal
      ) : (
        <IconButton
          buttonType="edit"
          icon={<EditSquare />}
          onClick={() => href && push(href)}
        />
      )}
    </div>
  );
}
