import type {
  Patient,
  PatientPayload,
  PatientListParams,
  Weekdays,
} from "../types/patient";
import { api } from "./axios";

export async function listPatients(
  params?: PatientListParams,
): Promise<Patient[]> {
  const response = await api.get("/patients-with-treatment", { params });
  return response.data;
}

export async function listDailyTreatments(
  weekday: Weekdays,
): Promise<Patient[]> {
  const response = await api.get("/patients-with-treatment/daily", {
    params: { weekday },
  });
  return response.data;
}

export async function createPatient(payload: PatientPayload): Promise<Patient> {
  const response = await api.post("/patients-with-treatment", payload);
  return response.data;
}

export async function getPatient(uuid: string): Promise<Patient> {
  const response = await api.get(`/patients-with-treatment/${uuid}`);
  return response.data;
}

export async function updatePatient(
  uuid: string,
  payload: PatientPayload,
): Promise<Patient> {
  const response = await api.patch(`/patients-with-treatment/${uuid}`, payload);
  return response.data;
}

export async function deletePatient(uuid: string): Promise<Patient> {
  const response = await api.post(`/patients-with-treatment/${uuid}`);
  return response.data;
}
