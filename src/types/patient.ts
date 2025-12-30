export interface Patient {
  user_uuid: string;
  patient_id: string;
  weekday: string;
  start_time: string;
  end_time: string;
  id: number;
  uuid: string;
  patient: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    birth_date: string;
    id: number;
    uuid: string;
    full_name: string;
  };
}

export interface PatientPayload {
  patient_schema: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    birth_date: string;
  };
  treatment_schema: {
    user_uuid: string;
    patient_id: string;
    weekday: string;
    start_time: string;
    end_time: string;
  };
}

export interface PatientUpdatePayload extends Partial<Patient> {
  patient_schema?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    birth_date?: string;
  };
  treatment_schema?: {
    user_uuid?: string;
    patient_id?: string;
    weekday?: string;
    start_time?: string;
    end_time?: string;
  };
}
