import type { CSSProperties } from "react";
import styles from "./button.module.css";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  type = "button",
  className,
  style,
  disabled,
}: ButtonProps) {
  return (
    <button
      className={className || styles.button}
      style={style}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
