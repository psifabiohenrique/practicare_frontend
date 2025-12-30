import { useState, useEffect } from "react";
import { getMe, update } from "../../../api/user.service";
import type { UpdatePayload } from "../../../types/user";
import TextField from "../../../components/TextField/TextField";
import Button from "../../../components/Button/Button";

export function UpdateUserPage() {
  const [user, setUser] = useState<UpdatePayload>({
    name: "",
    email: "",
    password: undefined,
    password_confirmation: undefined,
  });

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getMe();
      setUser(response);
    };
    fetchUser();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    const me = await getMe();
    e.preventDefault();
    await update(me.id, user);
  }

  return (
    <div>
      <h1>Atualizar Perfil</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          type="text"
          placeholder="Nome"
          label="Nome"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <TextField
          type="email"
          placeholder="Email"
          label="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <TextField
          type="password"
          placeholder="Senha"
          label="Senha"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <TextField
          type="password"
          placeholder="Confirmar Senha"
          label="Confirmar Senha"
          value={user.password_confirmation}
          onChange={(e) =>
            setUser({ ...user, password_confirmation: e.target.value })
          }
        />
        <Button type="submit">Atualizar</Button>
      </form>
    </div>
  );
}
