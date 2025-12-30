import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import TextField from "../../components/TextField/TextField";
import Button from "../../components/Button/Button";
import Form from "../../components/Form/Form";
import { Link, useNavigate } from "react-router-dom";
import { MessageCard } from "../../components/MessageCard/MessageCard";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    title: string;
    message: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    setMessage(null);
    e.preventDefault();
    try {
      await login(email, password);
      setMessage({ title: "Sucesso", message: "Login realizado com sucesso!" });
      navigate("/");
    } catch (error) {
      setMessage({ title: "Erro", message: "Erro ao fazer login" });
    }
  }

  return (
    <>
      <h1>Login</h1>
      {message && (
        <MessageCard title={message.title} message={message.message} />
      )}
      <Form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          type="password"
          label="Senha"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Entrar</Button>
      </Form>
      <p>
        Não tem uma conta? <Link to="/register">Cadastre-se</Link>
      </p>
    </>
  );
}
