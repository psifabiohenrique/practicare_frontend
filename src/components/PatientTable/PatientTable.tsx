import { PatientListCard } from "../PatientListCard/PatientListCard";
import type { Patient } from "../../types/patient";

interface PatientTableProps {
  data: Patient[];
  onNameClick: () => void;
}

export function PatientTable({ data, onNameClick }: PatientTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>
            <button onClick={onNameClick}>Nome completo</button>
          </th>
          <th>Dia de atendimento</th>
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
