export interface Patient {
  user_uuid: string;
  patient_uuid: string;
  weekday: string;
  start_time: string;
  end_time: string;
  uuid: string;
  patient: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    birth_date: string;
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
    patient_uuid: string;
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
    patient_uuid?: string;
    weekday?: string;
    start_time?: string;
    end_time?: string;
  };
}
