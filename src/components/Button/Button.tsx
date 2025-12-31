import styles from "./button.module.css";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  type = "button",
  className,
  disabled,
}: ButtonProps) {
  return (
    <button
      className={className || styles.button}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
