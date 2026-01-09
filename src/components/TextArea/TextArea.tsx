import type { ChangeEvent } from "react";
import styles from "./TextArea.module.css";

interface TextAreaProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  rows?: number;
  name?: string;
}

export function TextArea({
  label,
  placeholder,
  value,
  onChange,
  required,
  rows = 4,
  name,
}: TextAreaProps) {
  return (
    <div className={styles.container}>
      <label>{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
      />
    </div>
  );
}
