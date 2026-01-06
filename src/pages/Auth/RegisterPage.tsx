import { Link } from "react-router-dom";
import { RegisterForm } from "../../components/RegisterForm/RegisterForm";
import styles from "./LoginCreatePage.module.css";

export function RegisterPage() {
  return (
    <div className={styles.loginContainer}>
      <h1>Register</h1>

      <RegisterForm />
      <p>
        Já tem uma conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  );
}
