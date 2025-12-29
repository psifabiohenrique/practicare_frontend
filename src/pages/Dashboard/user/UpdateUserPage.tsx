import { useState, useEffect } from "react";
import { getMe, update } from "../../../api/user.service";
import type { UpdatePayload } from "../../../types/user";

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
        <input
          type="text"
          placeholder="Nome"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Senha"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <input
          type="password"
          placeholder="Confirmar Senha"
          value={user.password_confirmation}
          onChange={(e) =>
            setUser({ ...user, password_confirmation: e.target.value })
          }
        />
        <button type="submit">Atualizar</button>
      </form>
    </div>
  );
}
