import Button from "../Button/Button";
import type { Patient } from "../../types/patient";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import {
  formatDate,
  formatTime,
  translateWeekday,
  translateGender,
} from "../../utils/formatters";
import styles from "./PatientDetailCard.module.css";
import type { ModalType } from "../../pages/Dashboard/patients/PatientDetailPage";
import { useEffect, useState } from "react";
import { getPatient } from "../../api/patient.service";
import { useRecording } from "../AudioRecorder/AudioRecorderContext";

interface PatientDetailCardProps {
  uuid: string;
  onOpenModal: (modalType: ModalType, uuid: string, title: string) => void;
  refreshKey: number;
}

export function PatientDetailCard({
  uuid,
  onOpenModal,
  refreshKey,
}: PatientDetailCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const recording = useRecording();

  useEffect(() => {
    if (uuid) {
      getPatient(uuid)
        .then(setPatient)
        .finally(() => setIsLoading(false));
    }
  }, [uuid, refreshKey]);

  function handlePhoneClick() {
    window.open(`https://wa.me/${patient?.patient.phone}`, "_blank");
  }

  function handleEmailClick() {
    window.open(`mailto:${patient?.patient.email}`, "_blank");
  }

  function handleStartRecording() {
    if (patient) {
      recording.setPatient(patient);
    }
  }

  return isLoading ? (
    <div>Carregando...</div>
  ) : (
    <div className={styles.patientDetailCard}>
      <h1>Detalhes do Paciente</h1>
      <Button
        onClick={() => onOpenModal("patient_form", uuid, "Editar Paciente")}
      >
        Editar
      </Button>
      <Button onClick={handleStartRecording}>
        Iniciar Registro
      </Button>

      <section>
        <h3>Dados Pessoais</h3>
        <p>
          <strong>Nome:</strong> {patient?.patient.full_name}
        </p>
        <p className={styles.email} onClick={handleEmailClick}>
          <strong>E-mail:</strong> {patient?.patient.email}
        </p>
        <p onClick={handlePhoneClick} className={styles.phone}>
          <strong>Telefone:</strong>{" "}
          {patient?.patient.phone
            ? formatPhoneNumberIntl(patient.patient.phone)
            : "N/A"}
        </p>
        <p>
          <strong>Data de Nascimento:</strong>{" "}
          {patient?.patient.birth_date &&
            formatDate(patient.patient.birth_date)}
        </p>
        <p>
          <strong>Gênero:</strong>{" "}
          {patient?.patient.gender && translateGender(patient?.patient.gender)}
        </p>
      </section>

      <section>
        <h3>Dados do Tratamento</h3>
        <p>
          <strong>Dia da Semana:</strong>{" "}
          {patient?.weekday && translateWeekday(patient.weekday)}
        </p>
        <p>
          <strong>Horário:</strong>{" "}
          {patient?.start_time && formatTime(patient.start_time)} -{" "}
          {patient?.end_time && formatTime(patient.end_time)}
        </p>
      </section>
    </div>
  );
}
