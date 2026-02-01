export type Gender = "Male" | "Female" | "Other";

export type Weekdays =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type PatientStatus = "Active" | "Inactive";

export interface Patient {
  user_uuid: string;
  patient_uuid: string;
  weekday: Weekdays;
  status: PatientStatus;
  start_time: string;
  end_time: string;
  uuid: string;
  patient: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    birth_date: string;
    gender: Gender;
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
    gender: Gender;
  };
  treatment_schema: {
    user_uuid: string;
    patient_uuid: string;
    weekday: Weekdays;
    start_time: string;
    end_time: string;
  };
}

export interface PatientUpdatePayload {
  patient_schema?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    birth_date?: string;
    gender?: Gender;
  };
  treatment_schema?: {
    user_uuid?: string;
    patient_uuid?: string;
    weekday?: Weekdays;
    start_time?: string;
    end_time?: string;
  };
}

export interface PatientListParams {
  skip?: number;
  limit?: number;
  order_by?: "name" | "birth_date";
  order_dir?: "asc" | "desc";
  gender?: Gender;
  weekday?: Weekdays;
  status?: PatientStatus;
  search?: string;
}
