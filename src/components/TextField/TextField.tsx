import styles from "./text-field.module.css";

interface TextFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export default function TextField({
  label,
  placeholder,
  value,
  onChange,
  required,
}: TextFieldProps) {
  return (
    <div className={styles.container}>
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
