import styles from "./text-field.module.css";

interface TextFieldProps {
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  name?: string;
}

export default function TextField({
  label,
  placeholder,
  type,
  value,
  onChange,
  required,
  name,
}: TextFieldProps) {
  return (
    <div className={styles.container}>
      <label>{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
