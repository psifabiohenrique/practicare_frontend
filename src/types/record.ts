export interface Record {
  uuid: string;
  treatment_uuid: string;
  date: string;
  start_time: string;
  end_time: string;
  content: string;
  record_number: number | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export type RecordPayload = Pick<
  Record,
  "treatment_uuid" | "content" | "date" | "start_time" | "end_time"
>;

export type RecordUpdatePayload = Partial<
  Omit<RecordPayload, "treatment_uuid">
>;

export type RecordListParams = {
  skip?: number;
  limit?: number;
  include_archived?: boolean;
};
