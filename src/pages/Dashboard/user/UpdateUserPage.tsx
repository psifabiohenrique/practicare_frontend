import { useEffect, useState } from "react";
import { update } from "../../../api/user.service";
import type { UpdatePayload } from "../../../types/user";
import TextField from "../../../components/TextField/TextField";
import Button from "../../../components/Button/Button";
import { useUser } from "../../../hooks/useUser";
import { showSuccess, showError } from "../../../utils/swal";

export function UpdateUserPage() {
  const [user, setUser] = useState<UpdatePayload>({
    name: "",
    email: "",
    password: undefined,
    password_confirmation: undefined,
  });

  const { data: me, isLoading, refetch } = useUser();

  useEffect(() => {
    if (me) {
      setUser({
        name: me.name,
        email: me.email,
      });
    }
  }, [me]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (me) {
        await update(me.uuid, user);
        refetch();
        showSuccess("Sucesso", "Perfil atualizado com sucesso!");
      }
    } catch (error) {
      console.error(error);
      showError("Erro", "Erro ao atualizar perfil");
    }
  }

  if (isLoading) {
    return <div>Carregando...</div>;
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
