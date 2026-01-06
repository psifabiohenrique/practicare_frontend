import "react-phone-number-input/style.css";
import PhoneInputLib from "react-phone-number-input";
import styles from "./PhoneInput.module.css";

interface PhoneInputProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange: (value?: string) => void;
  required?: boolean;
}

export default function PhoneInput({
  label,
  placeholder,
  value,
  onChange,
  required,
}: PhoneInputProps) {
  return (
    <div className={styles.container}>
      <label>{label}</label>
      <div className={styles.phoneInputContainer}>
        <PhoneInputLib
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          defaultCountry="BR"
          international
          withCountryCallingCode
          required={required}
        />
      </div>
    </div>
  );
}
