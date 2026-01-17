import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { Status } from "../../types/audioRecorderStatus";
import type {
  StatusType,
  RecordingContextData,
} from "../../types/audioRecorderStatus";
import type { Patient } from "../../types/patient";
import { submitAutomatedRecord } from "../../api/record.service";

const RecordingContext = createContext<RecordingContextData | undefined>(
  undefined,
);

export const useRecording = () => {
  const context = useContext(RecordingContext);
  if (!context) {
    throw new Error("useRecording must be used within a RecordingProvider");
  }
  return context;
};

export const RecordingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [status, setStatus] = useState<StatusType>(Status.idle);
  const [patient, setPatientState] = useState<Patient | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [captureTabAudio, setCaptureTabAudio] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const displayStreamRef = useRef<MediaStream | null>(null);
  const timeRef = useRef<number | null>(null);
  const statusRef = useRef<StatusType>(Status.idle);
  const pendingFinalizeRef = useRef(false);

  const setPatient = (p: Patient) => {
    setPatientState(p);
    setStatus(Status.inactive);
  };

  const clearPatient = () => {
    setPatientState(null);
    setAudioChunks([]);
    setElapsedTime(0);
  };

  const preferredMimeTypes = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg",
  ];

  const mimeType = preferredMimeTypes.find((type) =>
    MediaRecorder.isTypeSupported(type),
  );

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(
          (device) => device.kind === "audioinput",
        );
        setDevices(audioInputs);
        if (audioInputs.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(audioInputs[0].deviceId);
        }
      } catch (error) {
        console.error("Error enumerating devices:", error);
      }
    };
    getDevices();
  }, [selectedDeviceId]);

  const startRecording = async () => {
    try {
      if (!mimeType) {
        alert(
          "Este navegador não suporta o formato de áudio adequado, por favor utilize outro.",
        );
        throw new Error("Nenhum mimeType de áudio suportado neste browser");
      }

      const constraints: MediaStreamConstraints = {
        audio: selectedDeviceId
          ? { deviceId: { exact: selectedDeviceId } }
          : true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      let finalStream = stream;

      if (captureTabAudio) {
        try {
          const displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
          });
          displayStreamRef.current = displayStream;

          const audioContext = new AudioContext();
          const micSource = audioContext.createMediaStreamSource(stream);
          const tabSource = audioContext.createMediaStreamSource(displayStream);
          const destination = audioContext.createMediaStreamDestination();

          micSource.connect(destination);
          tabSource.connect(destination);

          finalStream = destination.stream;
        } catch (err) {
          console.error("Error capturing tab audio:", err);
          // Fallback to just mic if user cancels tab selection OR browser doesn't support it
        }
      }

      const mediaRecorder = new MediaRecorder(finalStream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      mediaRecorder.onstop = () => {
        setAudioChunks(chunks);

        releaseMicrophone();
        if (pendingFinalizeRef.current) {
          pendingFinalizeRef.current = false;
          finalizeSubmitRecordingWithChunks(chunks);
        }
      };
      mediaRecorder.start();
      setStatus(Status.recording);
      statusRef.current = Status.recording;

      timeRef.current = setInterval(() => {
        if (statusRef.current === Status.recording) {
          setElapsedTime((prev) => prev + 1);
        }
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && statusRef.current === Status.paused) {
      mediaRecorderRef.current.resume();
      setStatus(Status.recording);
      statusRef.current = Status.recording;
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && statusRef.current === Status.recording) {
      mediaRecorderRef.current.pause();
      setStatus(Status.paused);
      statusRef.current = Status.paused;
    }
  };

  const hide = () => {
    setStatus(Status.idle);
    statusRef.current = Status.idle;
    releaseMicrophone();
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      (statusRef.current === Status.recording ||
        statusRef.current === Status.paused)
    ) {
      mediaRecorderRef.current.stop();
      setStatus(Status.inactive);
      statusRef.current = Status.inactive;
      if (timeRef.current) clearInterval(timeRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    releaseMicrophone();
    setStatus(Status.inactive);
    statusRef.current = Status.inactive;
    setAudioChunks([]);
    setElapsedTime(0);
    pendingFinalizeRef.current = false;
    if (timeRef.current) clearInterval(timeRef.current);
  };

  const finalizeSubmitRecordingWithChunks = async (chunks: Blob[]) => {
    if (!patient || chunks.length === 0) return;

    const audioBlob = new Blob(chunks, { type: mimeType });
    // download
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${patient.patient.first_name} - ${new Date().toLocaleString().split("T")[0].replace(/[:.]/g, "-")}.webm`;
    a.click();
    URL.revokeObjectURL(url);
    // upload
    const formData = new FormData();
    formData.append("audio_file", audioBlob);
    formData.append("session_date", new Date().toISOString().split("T")[0]);
    try {
      await submitAutomatedRecord(patient.uuid, formData);
      alert("Áudio enviado com sucesso!");
      clearPatient();
      setStatus(Status.idle);
      statusRef.current = Status.idle;
      if (timeRef.current) clearInterval(timeRef.current);
    } catch (error) {
      console.error("Error submitting record:", error);
      alert("Erro ao enviar áudio.");
    }
  };

  const releaseMicrophone = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (displayStreamRef.current) {
      displayStreamRef.current.getTracks().forEach((track) => track.stop());
      displayStreamRef.current = null;
    }
  };

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const value: RecordingContextData = {
    status,
    patient,
    elapsedTime,
    audioChunks,
    mediaRecorderRef: mediaRecorderRef.current,
    streamRef: streamRef.current,
    timeRef: timeRef.current ? Number(timeRef.current) : null,
    pendingFinalizeRef,
    devices,
    selectedDeviceId,
    captureTabAudio,
    setPatient,
    clearPatient,
    setSelectedDeviceId,
    setCaptureTabAudio,
    startRecording,
    resumeRecording,
    pauseRecording,
    stopRecording,
    cancelRecording,
    finalizeSubmitRecordingWithChunks,
    hide,
  };

  return (
    <RecordingContext.Provider value={value}>
      {children}
    </RecordingContext.Provider>
  );
};
