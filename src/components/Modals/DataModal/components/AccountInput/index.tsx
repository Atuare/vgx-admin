import { ChangeEvent, useEffect, useRef, useState } from "react";

interface AccountInputProps {
  defaultValue: string;
  onChange: (value: string) => void;
}

export function AccountInput({ defaultValue, onChange }: AccountInputProps) {
  const [firstAccount, setFirstAccount] = useState(
    defaultValue?.slice(0, 7) ?? "",
  );
  const [secondAccount, setSecondAccount] = useState(
    defaultValue?.slice(7) ?? "",
  );

  const bankAccountFirstInput = useRef<HTMLInputElement | null>(null);
  const bankAccountSecondInput = useRef<HTMLInputElement | null>(null);

  function handleChangeBankAccount(
    event: ChangeEvent<HTMLInputElement>,
    index: number,
  ) {
    const numericValue = event.target.value.replace(/\D/g, "");

    if (numericValue.length >= 7) {
      bankAccountSecondInput.current?.focus();
    }

    index === 0
      ? setFirstAccount(numericValue)
      : setSecondAccount(numericValue);
  }

  useEffect(() => {
    const account = `${firstAccount}${secondAccount}`;
    onChange(account);
  }, [firstAccount, secondAccount]);

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input
        type="text"
        id="Conta"
        pattern="\d*"
        maxLength={7}
        value={firstAccount}
        ref={bankAccountFirstInput}
        onChange={e => {
          handleChangeBankAccount(e, 0);
        }}
      />

      <input
        style={{ width: 80 }}
        pattern="\d*"
        maxLength={1}
        value={secondAccount}
        onChange={e => {
          handleChangeBankAccount(e, 1);
        }}
        onKeyDown={e => {
          if (e.key === "Backspace" && secondAccount.trim() === "") {
            setTimeout(() => {
              bankAccountFirstInput.current?.focus();
            }, 1);
          }
        }}
        ref={bankAccountSecondInput}
      />
    </div>
  );
}
