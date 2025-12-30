import { Link } from "react-router-dom";
import { RegisterForm } from "../../components/RegisterForm/RegisterForm";

export function RegisterPage() {
  return (
    <>
      <h1>Register</h1>

      <RegisterForm />
      <p>
        Já tem uma conta? <Link to="/login">Entrar</Link>
      </p>
    </>
  );
}
