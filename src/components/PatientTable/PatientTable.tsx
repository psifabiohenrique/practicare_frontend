import { PatientListCard } from "../PatientListCard/PatientListCard";
import type { Patient } from "../../types/patient";

interface PatientTableProps {
  data: Patient[];
}

export function PatientTable({ data }: PatientTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nome completo</th>
          <th>Data de Nascimento</th>
          <th>Telefone</th>
        </tr>
      </thead>
      <tbody>
        {data ? (
          data?.map((patient) => (
            <PatientListCard key={patient.uuid} patient={patient} />
          ))
        ) : (
          <tr>
            <td>Nenhum paciente encontrado. Cadastre o primeiro paciente.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
