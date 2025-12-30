import type { Patient, PatientPayload } from "../types/patient";
import { api } from "./axios";

export async function listPatients(): Promise<Patient[]> {
  const response = await api.get("/patients-with-treatment/");
  return response.data;
}

export async function createPatient(payload: PatientPayload): Promise<Patient> {
  const response = await api.post("/patients-with-treatment/", payload);
  return response.data;
}
