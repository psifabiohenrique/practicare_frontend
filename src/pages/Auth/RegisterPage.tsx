import { useState } from "react";
import { register } from "../../api/user.service";
import Form from "../../components/Form/Form";
import TextField from "../../components/TextField/TextField";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await register({ name, email, password, password_confirmation });
  }

  return (
    <>
      <h1>Register</h1>
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
      <p>
        Já tem uma conta? <Link to="/login">Entrar</Link>
      </p>
    </>
  );
}
