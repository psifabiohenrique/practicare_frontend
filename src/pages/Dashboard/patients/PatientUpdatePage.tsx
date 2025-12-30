import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatient, updatePatient } from "../../../api/patient.service";
import { PatientForm } from "../../../components/PatientForm/PatientForm";
import type { Patient, PatientPayload } from "../../../types/patient";

export function PatientUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getPatient(Number(id))
        .then(setPatient)
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  async function handleUpdate(payload: PatientPayload) {
    if (id) {
      await updatePatient(Number(id), payload);
      navigate(`/patient/${id}`);
    }
  }

  if (isLoading) return <div>Carregando...</div>;
  if (!patient) return <div>Paciente não encontrado.</div>;

  return (
    <div>
      <h1>Editar Paciente</h1>
      <button onClick={() => navigate(-1)}>Voltar</button>
      <PatientForm
        initialData={patient}
        onSubmit={handleUpdate}
        submitButtonText="Atualizar Paciente"
        successMessage="Paciente atualizado com sucesso!"
      />
    </div>
  );
}
