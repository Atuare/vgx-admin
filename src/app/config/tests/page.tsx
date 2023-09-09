import { AddCircle, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import styles from "./TestsConfig.module.scss";

export default function TestsConfigPage() {
  return (
    <div className={styles.test}>
      <section className={styles.test__actions}>
        <Button
          buttonType="secondary"
          text="Exportar dados"
          icon={<SystemUpdate />}
        />

        <Button buttonType="primary" text="Nova Prova" icon={<AddCircle />} />
      </section>
    </div>
  );
}
