import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPatient } from "../../../api/patient.service";
import type { Patient } from "../../../types/patient";

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getPatient(Number(id))
        .then(setPatient)
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) return <div>Carregando...</div>;
  if (!patient) return <div>Paciente não encontrado.</div>;

  return (
    <div>
      <h1>Detalhes do Paciente</h1>
      <Link to="/patient">Voltar para lista</Link>
      <Link to={`/patient/${id}/edit`}>Editar</Link>

      <section>
        <h3>Dados Pessoais</h3>
        <p>
          <strong>Nome:</strong> {patient.patient.full_name}
        </p>
        <p>
          <strong>E-mail:</strong> {patient.patient.email}
        </p>
        <p>
          <strong>Telefone:</strong> {patient.patient.phone}
        </p>
        <p>
          <strong>Data de Nascimento:</strong> {patient.patient.birth_date}
        </p>
      </section>

      <section>
        <h3>Dados do Tratamento</h3>
        <p>
          <strong>Dia da Semana:</strong> {patient.weekday}
        </p>
        <p>
          <strong>Horário:</strong> {patient.start_time} - {patient.end_time}
        </p>
      </section>
    </div>
  );
}
