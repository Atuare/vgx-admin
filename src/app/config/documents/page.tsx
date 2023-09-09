import { AddCircle, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import styles from "./DocumentsConfig.module.scss";

export default function DocumentsConfigPage() {
  return (
    <div className={styles.documents}>
      <section className={styles.documents__actions}>
        <Button
          buttonType="secondary"
          text="Exportar dados"
          icon={<SystemUpdate />}
        />

        <Button
          buttonType="primary"
          text="Novo Documento"
          icon={<AddCircle />}
        />
      </section>
    </div>
  );
}
