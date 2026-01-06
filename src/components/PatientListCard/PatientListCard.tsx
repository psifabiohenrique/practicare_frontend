import { useNavigate } from "react-router-dom";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import type { Patient } from "../../types/patient";
import { translateWeekday } from "../../utils/formatters";
import styles from "./patient-list-card.module.css";

interface PatientListCardProps {
  patient: Patient;
}

export function PatientListCard({ patient }: PatientListCardProps) {
  const navigate = useNavigate();

  return (
    <li className={styles.card}>
      <div
        className={styles.cardHeader}
        onClick={() => navigate(`/patient/${patient.uuid}`)}
      >
        <span className={styles.patientName}>{patient.patient.full_name}</span>
        <span className={styles.weekday}>
          {translateWeekday(patient.weekday)}
        </span>
      </div>
      <div
        className={styles.infoRow}
        onClick={() => window.open(`https://wa.me/${patient.patient.phone}`)}
      >
        <span>📞</span>
        <span className={styles.phone}>
          {patient.patient.phone
            ? formatPhoneNumberIntl(patient.patient.phone)
            : "N/A"}
        </span>
      </div>
    </li>
  );
}
