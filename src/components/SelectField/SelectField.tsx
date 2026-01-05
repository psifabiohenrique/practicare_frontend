import styles from "./select-field.module.css";

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
  required?: boolean;
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}: SelectFieldProps) {
  return (
    <div className={styles.container}>
      <label>{label}</label>
      <select value={value} onChange={onChange} required={required}>
        <option value="">Selecione...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
