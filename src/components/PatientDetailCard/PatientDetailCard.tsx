import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import type { Patient } from "../../types/patient";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import {
  formatDate,
  formatTime,
  translateWeekday,
  translateGender,
} from "../../utils/formatters";
import styles from "./PatientDetailCard.module.css";

interface PatientDetailCardProps {
  patient: Patient;
  uuid: string;
}

export function PatientDetailCard({ patient, uuid }: PatientDetailCardProps) {
  const navigate = useNavigate();

  function handlePhoneClick() {
    window.open(`https://wa.me/${patient.patient.phone}`, "_blank");
  }

  function handleEmailClick() {
    window.open(`mailto:${patient.patient.email}`, "_blank");
  }

  return (
    <div className={styles.patientDetailCard}>
      <h1>Detalhes do Paciente</h1>
      <Button onClick={() => navigate(`/patient/${uuid}/edit`)}>Editar</Button>

      <section>
        <h3>Dados Pessoais</h3>
        <p>
          <strong>Nome:</strong> {patient.patient.full_name}
        </p>
        <p className={styles.email} onClick={handleEmailClick}>
          <strong>E-mail:</strong> {patient.patient.email}
        </p>
        <p onClick={handlePhoneClick} className={styles.phone}>
          <strong>Telefone:</strong>{" "}
          {patient.patient.phone
            ? formatPhoneNumberIntl(patient.patient.phone)
            : "N/A"}
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
