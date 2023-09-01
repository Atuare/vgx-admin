import React from "react";
import styles from "./FlatText.module.scss";

export default function FlatText({
  text,
  styleProps,
}: {
  text: string;
  styleProps: React.StyleHTMLAttributes<HTMLDivElement>["style"];
}) {
  return (
    <div className={styles.flatText} style={styleProps}>
      <span>{text}</span>
    </div>
  );
}
