import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatient } from "../../../api/patient.service";
import type { Patient } from "../../../types/patient";
import { PatientDetailCard } from "../../../components/PatientDetailCard/PatientDetailCard";
import { RecordList } from "../../../components/RecordList/RecordList";
import styles from "./PatientDetailPage.module.css";

export function PatientDetailPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (uuid) {
      getPatient(uuid)
        .then(setPatient)
        .finally(() => setIsLoading(false));
    }
  }, [uuid]);

  if (isLoading) return <div>Carregando...</div>;
  if (!patient) return <div>Paciente não encontrado.</div>;

  return (
    <div className={styles.patientDetailPage}>
      <PatientDetailCard patient={patient} uuid={uuid!} />
      <RecordList />
    </div>
  );
}
