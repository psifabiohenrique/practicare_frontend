import type { PatientPayload } from "../../types/patient";

export function validatePatient(data: PatientPayload) {
  const errors: Record<string, string> = {};

  // Patient Schema Validation
  if (!data.patient_schema.first_name) {
    errors.first_name = "O primeiro nome é obrigatório.";
  }
  if (!data.patient_schema.last_name) {
    errors.last_name = "O sobrenome é obrigatório.";
  }
  if (!data.patient_schema.email) {
    errors.email = "O e-mail é obrigatório.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.patient_schema.email)) {
    errors.email = "E-mail inválido.";
  }
  if (!data.patient_schema.phone) {
    errors.phone = "O telefone é obrigatório.";
  }
  if (!data.patient_schema.birth_date) {
    errors.birth_date = "A data de nascimento é obrigatória.";
  }
  if (!data.patient_schema.gender) {
    errors.gender = "O gênero é obrigatório.";
  }

  // Treatment Schema Validation
  if (!data.treatment_schema.weekday) {
    errors.weekday = "O dia da semana é obrigatório.";
  }
  if (!data.treatment_schema.start_time) {
    errors.start_time = "O horário de início é obrigatório.";
  }
  if (!data.treatment_schema.end_time) {
    errors.end_time = "O horário de término é obrigatório.";
  }

  return errors;
}
