import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PatientDetailCard } from "../../../components/PatientDetailCard/PatientDetailCard";
import { TreatmentContextCard } from "../../../components/TreatmentContextCard/TreatmentContextCard";
import { RecordList } from "../../../components/RecordList/RecordList";
import { Modal } from "../../../components/Modal/Modal";
import { RecordDetail } from "../../../components/RecordDetail/RecordDetail";
import { RecordForm } from "../../../components/RecordForm/RecordForm";
import { ReportList } from "../../../components/ReportList/ReportList";
import { ReportForm } from "../../../components/ReportForm/ReportForm";
import { ReportDetail } from "../../../components/ReportDetail/ReportDetail";
import styles from "./PatientDetailPage.module.css";
import { PatientForm } from "../../../components/PatientForm/PatientForm";

export type ModalType =
  | "record_detail"
  | "record_form"
  | "report_detail"
  | "report_form"
  | "patient_form"
  | "referral"; // Expandable

interface ModalState {
  type: ModalType | null;
  uuid?: string;
  title?: string;
}

export function PatientDetailPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const [refreshRecordsKey, setRefreshRecordsKey] = useState(0);
  const [refreshReportsKey, setRefreshReportsKey] = useState(0);
  const [refreshPatientKey, setRefreshPatientKey] = useState(0);
  const [refreshContextKey, setRefreshContextKey] = useState(0);
  const [prevUuid, setPrevUuid] = useState(uuid);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Synchronize transition state during render to avoid duplicate fetches
  if (uuid !== prevUuid) {
    setPrevUuid(uuid);
    setIsTransitioning(true);
  }

  const [modalState, setModalState] = useState<ModalState>({
    type: null,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 400); // Exibe o overlay de transição por 400ms para limpar o estado antigo
    return () => clearTimeout(timer);
  }, [uuid]);

  useEffect(() => {
    const handleAiRecordCreated = () => {
      setRefreshRecordsKey((prev) => prev + 1);
      setRefreshContextKey((prev) => prev + 1);
    };
    window.addEventListener("ai_record_created", handleAiRecordCreated);
    return () => {
      window.removeEventListener("ai_record_created", handleAiRecordCreated);
    };
  }, []);

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
    setRefreshRecordsKey((prev) => prev + 1);
    handleCloseModal();
  }, [handleCloseModal]);

  const handleReportSuccess = useCallback(() => {
    setRefreshReportsKey((prev) => prev + 1);
    handleCloseModal();
  }, [handleCloseModal]);

  const handlePatientSuccess = useCallback(() => {
    setRefreshPatientKey((prev) => prev + 1);
    handleCloseModal();
  }, [handleCloseModal]);

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
      case "report_detail":
        return <ReportDetail reportUuid={modalState.uuid!} />;
      case "report_form":
        return (
          <ReportForm
            treatmentUuid={uuid}
            reportUuid={modalState.uuid}
            onSuccess={handleReportSuccess}
          />
        );
      case "patient_form":
        return <PatientForm uuid={uuid} onSuccess={handlePatientSuccess} />;
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
      case "report_detail":
        return "Detalhes do Relatório";
      case "report_form":
        return modalState.uuid ? "Editar Relatório" : "Novo Relatório";
      default:
        return "";
    }
  };

  if (isTransitioning) {
    return (
      <div className={styles.patientDetailPage} style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
        <h2>Carregando informações do paciente...</h2>
      </div>
    );
  }

  return (
    <div className={styles.patientDetailPage} key={uuid}>
      <PatientDetailCard
        uuid={uuid!}
        onOpenModal={handleOpenModal}
        refreshKey={refreshPatientKey}
      />
      <TreatmentContextCard
        treatmentId={uuid!}
        refreshKey={refreshContextKey}
      />
      <RecordList
        treatmentId={uuid!}
        onOpenModal={handleOpenModal}
        refreshKey={refreshRecordsKey}
      />
      <ReportList
        treatmentId={uuid!}
        onOpenModal={handleOpenModal}
        refreshKey={refreshReportsKey}
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
