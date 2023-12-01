import { Close } from "@/assets/Icons";
import { deepEqual, includesDeep } from "@/utils/lodash";
import { useEffect, useState } from "react";
import { Checkbox } from "../Checkbox";
import styles from "./CheckBoard.module.scss";

interface CheckBoardProps {
  title: string;
  options: { name: string; id: string }[];
  onChange: (value: { name: string; id: string }[]) => void;
  defaultValue?: { name: string; id: string }[];
  error?: string;
}

export function CheckBoard({
  title,
  options,
  onChange,
  defaultValue,
  error,
}: CheckBoardProps) {
  const [select, setSelect] = useState<{ name: string; id: string }[]>(
    defaultValue ?? [],
  );

  const handleChangeCheckBox: any = (value: { name: string; id: string }) => {
    if (includesDeep(select, value)) {
      setSelect(select.filter(item => !deepEqual(item, value)));
    } else {
      setSelect([...select, value]);
    }
  };

  useEffect(() => {
    onChange(select);
  }, [select]);

  return (
    <div className={styles.checkBoard}>
      <div className={styles.checkBoard__header}>
        <p>
          {title}
          <span>*</span>
        </p>
      </div>
      <div className={styles.checkBoard__body}>
        <div className={styles.checkBoard__body__itemPreview}>
          {select.map(item => (
            <div key={crypto.randomUUID()}>
              <p>{item.name}</p>
              <button
                onClick={() =>
                  setSelect(
                    select.filter(selectItem => !deepEqual(selectItem, item)),
                  )
                }
              >
                <Close />
              </button>
            </div>
          ))}
        </div>
        <div className={styles.checkBoard__body__item}>
          {options?.map(value => (
            <Checkbox
              key={crypto.randomUUID()}
              iconType="solid"
              isActive={includesDeep(select, value)}
              onChangeCheckbox={() => handleChangeCheckBox(value)}
              value={value.name}
            />
          ))}
        </div>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
