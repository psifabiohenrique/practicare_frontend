import { useUser } from "../../hooks/useUser";

export function DashboardPage() {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Bem vindo ao Practicare, {user?.name}</h1>
      <p>O app de gestão clínica para profissionais de saúde autônomos.</p>
    </div>
  );
}
