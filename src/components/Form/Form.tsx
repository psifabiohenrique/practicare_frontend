import styles from "./form.module.css";

interface FormProps {
  children: React.ReactNode;
  grid?: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function Form({ children, onSubmit, grid }: FormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={`${styles.form} ${grid ? styles.grid : ""}`}
    >
      {children}
    </form>
  );
}
