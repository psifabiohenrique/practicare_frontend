import type { RefObject } from "react";
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
  audioChunks: Blob[];
  mediaRecorderRef: MediaRecorder | null;
  streamRef: MediaStream | null;
  timeRef: Number | null;
  pendingFinalizeRef: RefObject<boolean>;
  devices: MediaDeviceInfo[];
  selectedDeviceId: string;
  captureTabAudio: boolean;

  setPatient: (patient: Patient) => void;
  clearPatient: () => void;
  setSelectedDeviceId: (deviceId: string) => void;
  setCaptureTabAudio: (capture: boolean) => void;

  startRecording: () => void;
  resumeRecording: () => void;
  pauseRecording: () => void;
  stopRecording: () => void;
  cancelRecording: () => void;
  finalizeSubmitRecordingWithChunks: (chunks: Blob[]) => void;
  hide: () => void;
}
