import { Link } from "react-router-dom";
import type { Patient } from "../../types/patient";

interface PatientListCardProps {
  patient: Patient;
}

export function PatientListCard({ patient }: PatientListCardProps) {
  return (
    <tr key={patient.id}>
      <td>
        <Link to={`/patient/${patient.id}`}>{patient.patient.full_name}</Link>
      </td>
      <td>
        <Link to={`/patient/${patient.id}`}>{patient.patient.birth_date}</Link>
      </td>
      <td>{patient.patient.phone}</td>
    </tr>
  );
}
