import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatient, updatePatient } from "../../../api/patient.service";
import { PatientForm } from "../../../components/PatientForm/PatientForm";
import type { Patient, PatientPayload } from "../../../types/patient";
import Button from "../../../components/Button/Button";

export function PatientUpdatePage() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (uuid) {
      getPatient(uuid)
        .then(setPatient)
        .finally(() => setIsLoading(false));
    }
  }, [uuid]);

  async function handleUpdate(payload: PatientPayload) {
    if (uuid) {
      await updatePatient(uuid, payload);
      navigate(`/patient/${uuid}`);
    }
  }

  if (isLoading) return <div>Carregando...</div>;
  if (!patient) return <div>Paciente não encontrado.</div>;

  return (
    <div style={{ width: "100%" }}>
      <h1>Editar Paciente</h1>
      <Button onClick={() => navigate(-1)}>Voltar</Button>
      <PatientForm
        initialData={patient}
        onSubmit={handleUpdate}
        submitButtonText="Atualizar Paciente"
        successMessage="Paciente atualizado com sucesso!"
      />
    </div>
  );
}
