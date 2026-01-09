import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getPatient } from "../../../api/patient.service";
import type { Patient } from "../../../types/patient";
import { PatientDetailCard } from "../../../components/PatientDetailCard/PatientDetailCard";
import { RecordList } from "../../../components/RecordList/RecordList";
import { Modal } from "../../../components/Modal/Modal";
import { RecordDetail } from "../../../components/RecordDetail/RecordDetail";
import { RecordForm } from "../../../components/RecordForm/RecordForm";
import styles from "./PatientDetailPage.module.css";

export type ModalType = "record_detail" | "record_form" | "report" | "referral"; // Expandable

interface ModalState {
  type: ModalType | null;
  uuid?: string;
  title?: string;
}

export function PatientDetailPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [modalState, setModalState] = useState<ModalState>({
    type: null,
  });

  const handleOpenModal = useCallback(
    (type: ModalType, uuid?: string, title?: string) => {
      setModalState({ type, uuid, title });
    },
    []
  );

  const handleCloseModal = useCallback(() => {
    setModalState({ type: null });
  }, []);

  const handleRecordSuccess = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
    handleCloseModal();
  }, [handleCloseModal]);

  useEffect(() => {
    if (uuid) {
      getPatient(uuid)
        .then(setPatient)
        .finally(() => setIsLoading(false));
    }
  }, [uuid]);

  if (isLoading) return <div>Carregando...</div>;
  if (!patient) return <div>Paciente não encontrado.</div>;

  const renderModalContent = () => {
    switch (modalState.type) {
      case "record_detail":
        return <RecordDetail recordUuid={modalState.uuid!} />;
      case "record_form":
        return (
          <RecordForm
            treatmentUuid={uuid}
            recordUuid={modalState.uuid}
            onSuccess={handleRecordSuccess}
          />
        );
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    if (modalState.title) return modalState.title;
    switch (modalState.type) {
      case "record_detail":
        return "Detalhes do Registro";
      case "record_form":
        return modalState.uuid ? "Editar Registro" : "Nova Evolução";
      default:
        return "";
    }
  };

  return (
    <div className={styles.patientDetailPage}>
      <PatientDetailCard patient={patient} uuid={uuid!} />
      <RecordList
        treatmentId={uuid!}
        onOpenModal={handleOpenModal}
        refreshKey={refreshKey}
      />

      <Modal
        isOpen={!!modalState.type}
        onClose={handleCloseModal}
        title={getModalTitle()}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
}
