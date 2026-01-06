import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPatient } from "../../../api/patient.service";
import type { Patient } from "../../../types/patient";
import {
  formatDate,
  formatTime,
  translateWeekday,
  translateGender,
} from "../../../utils/formatters";
import Button from "../../../components/Button/Button";

export function PatientDetailPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
    <div>
      <h1>Detalhes do Paciente</h1>
      <Button onClick={() => navigate(`/patient/${uuid}/edit`)}>Editar</Button>

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
          <strong>Data de Nascimento:</strong>{" "}
          {formatDate(patient.patient.birth_date)}
        </p>
        <p>
          <strong>Gênero:</strong> {translateGender(patient.patient.gender)}
        </p>
      </section>

      <section>
        <h3>Dados do Tratamento</h3>
        <p>
          <strong>Dia da Semana:</strong> {translateWeekday(patient.weekday)}
        </p>
        <p>
          <strong>Horário:</strong> {formatTime(patient.start_time)} -{" "}
          {formatTime(patient.end_time)}
        </p>
      </section>
    </div>
  );
}
