import { useState } from "react";
import styles from "./AudioRecorder.module.css";
import { type StatusType, Status } from "../../types/audioRecorderStatus";
import Button from "../Button/Button";

interface Props {
  onFinalize: () => void;
}

export default function AudioRecorder({ onFinalize }: Props) {
  const [status, setStatus] = useState<StatusType>(Status.inactive);
  const [elapsedTime, setElapsedTime] = useState(0);

  const handleStartRecording = () => {
    setStatus(Status.recording);
    console.log("start");
  };
  const handlePauseRecording = () => {
    setStatus(Status.paused);
    console.log("pause");
  };
  const handleCancelRecording = () => {
    setStatus(Status.inactive);
  };
  const handleFinalizeRecording = () => {
    const mockAudioBlob = new Blob(["mock audio data"], { type: "audio/webm" });
    onFinalize();
    setElapsedTime(0);
    setStatus(Status.inactive);
    console.log("gravação cancelada");
  };
  return (
    <div className={styles.AudioRecorderContainer}>
      <h4>Registro de sessão</h4>
      <div className={styles.infoContainer}>
        <p>
          Status:{" "}
          {status === "inactive"
            ? "Inativo"
            : status === "recording"
              ? "Gravando"
              : "Pausado"}
        </p>
        <p>
          Tempo: {Math.floor(elapsedTime / 60)}:
          {(elapsedTime % 60).toString().padStart(2, "0")}
        </p>
      </div>
      <div>
        <Button
          className={styles.viewButton}
          onClick={handleStartRecording}
          disabled={status !== Status.inactive && status === Status.recording}
        >
          {status == Status.inactive ? "Iniciar" : "Recomeçar"}
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
      </div>
    </div>
  );
}
