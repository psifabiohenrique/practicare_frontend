import { useState } from "react";
import { register } from "../../api/user.service";
import Form from "../Form/Form";
import TextField from "../TextField/TextField";
import Button from "../Button/Button";
import { showSuccess, showError, showWarning } from "../../utils/swal";
import { validateRegister } from "./registerValidation";
import { useNavigate } from "react-router-dom";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validateRegister({
      name,
      email,
      password,
      password_confirmation,
    });
    if (Object.keys(errors).length > 0) {
      showWarning("Dados inválidos", Object.values(errors).join("\n"));
      return;
    }
    try {
      await register({
        name,
        email,
        password,
        password_confirmation,
      });
      await showSuccess("Sucesso", "Usuário cadastrado com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      showError("Erro", "Erro ao cadastrar usuário");
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <TextField
        label="Nome"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        label="Email"
        placeholder="Email"
        value={email}
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Senha"
        placeholder="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <TextField
        label="Confirmar Senha"
        placeholder="Confirmar Senha"
        type="password"
        value={password_confirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
        required
      />
      <Button type="submit">Cadastrar</Button>
    </Form>
  );
}
