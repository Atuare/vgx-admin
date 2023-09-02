import { EditSquare, Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";

export function AdmissionClass() {
  const handleInputValue = (value: string) => {};

  return (
    <div>
      <section>
        <p>Criado em dd/mm/aaaa hh:mm</p>
        <p>Por: Nome Examinador</p>
      </section>
      <section>
        <Button
          buttonType="secondary"
          text="Exportar dados"
          icon={<SystemUpdate />}
        />

        <SearchInput handleChangeValue={handleInputValue} icon={<Search />} />

        <div>
          <Button buttonType="secondary" text="Editar" icon={<EditSquare />} />
        </div>
      </section>
    </div>
  );
}
