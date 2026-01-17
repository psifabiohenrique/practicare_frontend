import styles from "./AudioRecorder.module.css";
import { Status } from "../../types/audioRecorderStatus";
import Button from "../Button/Button";
import { useRecording } from "./AudioRecorderContext";

export default function AudioRecorder() {
  const recording = useRecording();
  const {
    status,
    patient,
    elapsedTime,
    pendingFinalizeRef,
    startRecording,
    resumeRecording,
    pauseRecording,
    cancelRecording,
    stopRecording,
    hide,
  } = recording;

  const handleStartRecording = async () => {
    console.log(`Handle Start Recording: ${status}`);
    if (status === Status.inactive) {
      await startRecording();
    } else if (status === Status.paused) {
      resumeRecording();
    }
    console.log(`Handle Start Recording: ${status}`);
  };

  const handlePauseRecording = () => {
    console.log(`Handle pause Recording: ${status}`);

    pauseRecording();
    console.log(`Handle pause Recording: ${status}`);
  };

  const handleCancelRecording = () => {
    if (window.confirm("Tem certeza que deseja cancelar a gravação?")) {
      console.log(`Handle Cancel Recording: ${status}`);

      cancelRecording();
      console.log(`Handle Cancel Recording: ${status}`);
    }
  };

  const handleFinalizeRecording = () => {
    if (
      window.confirm("Tem certeza que deseja finalizar e enviar a gravação?")
    ) {
      pendingFinalizeRef.current = true;
      stopRecording()
    }
  };

  const handleHide = () => {
    hide();
  };

  return (
    <div
      className={`${styles.AudioRecorderContainer} ${status === Status.idle ? styles.hidden : ""}`}
    >
      <h4>Registro de sessão</h4>
      <div className={styles.infoContainer}>
        <p>Paciente: <span>{patient?.patient.first_name}</span></p>
        <p>
          Status do registro:{" "}<span>
          {status === "inactive"
            ? "Não iniciado"
            : status === "recording"
              ? "Gravando"
              : status === "paused"
                ? "Pausado"
                : "Idle"}</span>
        </p>
        <p>
          Tempo: <span>{Math.floor(Number(elapsedTime) / 60)}:
          {(Number(elapsedTime) % 60).toString().padStart(2, "0")}</span>
        </p>
      </div>
      <div>
        <Button
          className={styles.viewButton}
          onClick={handleStartRecording}
          disabled={status === Status.recording}
        >
          {status === Status.inactive
            ? "Iniciar"
            : status === Status.paused
              ? "Continuar"
              : "Recomeçar"}
        </Button>
        <Button
          className={styles.viewButton}
          onClick={handlePauseRecording}
          disabled={status !== Status.recording}
        >
          Pausar
        </Button>
        <Button
          className={styles.viewButton}
          onClick={handleCancelRecording}
          disabled={status === Status.inactive}
        >
          Cancelar
        </Button>
        <Button
          className={styles.viewButton}
          onClick={handleFinalizeRecording}
          disabled={status === Status.inactive}
        >
          Finalizar/Enviar
        </Button>
        {status === Status.inactive && (
          <Button className={styles.viewButton} onClick={handleHide}>
            Ocultar
          </Button>
        )}
      </div>
    </div>
  );
}
