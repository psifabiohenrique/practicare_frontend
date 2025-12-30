import { useState } from "react";
import { register } from "../../api/user.service";
import Form from "../Form/Form";
import TextField from "../TextField/TextField";
import Button from "../Button/Button";
import { MessageCard } from "../MessageCard/MessageCard";
import { validateRegister } from "./registerValidation";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [messages, setMessages] = useState<string[] | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validateRegister({
      name,
      email,
      password,
      password_confirmation,
    });
    if (Object.keys(errors).length > 0) {
      setMessages(Object.values(errors));
      return;
    }
    try {
      await register({
        name,
        email,
        password,
        password_confirmation,
      });
      setMessages(["Usuário cadastrado com sucesso!"]);
    } catch (error) {
      setMessages(["Erro ao cadastrar usuário"]);
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {messages && messages.map((message) => <MessageCard message={message} />)}
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
  );
}
