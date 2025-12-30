import { PatientTable } from "../../../components/PatientTable/PatientTable";
import { usePatients } from "../../../hooks/usePatients";

export function PatientListPage() {
  const { data, isLoading } = usePatients();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Lista de Pacientes</h1>
      {data && <PatientTable data={data} />}
    </div>
  );
}
