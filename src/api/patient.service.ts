import type { Patient } from "../types/patient";
import { api } from "./axios";

export async function listPatients(): Promise<Patient[]> {
  const response = await api.get("/patients-with-treatment/");
  return response.data;
}
