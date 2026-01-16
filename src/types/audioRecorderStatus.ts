import type { Patient } from "./patient";

export const Status = {
  idle: "idle",
  recording: "recording",
  paused: "paused",
  inactive: "inactive",
};

export type StatusType = (typeof Status)[keyof typeof Status];


export interface RecordingContextData {
  status: StatusType;
  patient: Patient | null;
  elapsedTime: Number;
  audioChunks: Blob[]
  mediaRecorderRef: MediaRecorder | null
  streamRef: MediaStream | null
  timeRef: Number | null;


  setPatient: (patient: Patient) => void;
  clearPatient: () => void;

  startRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  cancelRecording: () => void;
  finalizeSubmitRecording: (onFinalize: (audioBlob: Blob) => void) => void
}