import styles from "./button.module.css";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    type?: "button" | "submit" | "reset";
}

export default function Button({ children, onClick, type = "button" }: ButtonProps) {
    return (
        <button className={styles.button} onClick={onClick} type={type}>
            {children}
        </button>
    )
}
