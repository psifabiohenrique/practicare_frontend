import { api } from "./axios";
import type {
  Record,
  RecordUpdatePayload,
  RecordPayload,
  RecordListParams,
} from "../types/record";

export async function listRecords(
  treatment_uuid: string,
  params?: RecordListParams
): Promise<Record[]> {
  const response = await api.get(
    `/treatment-records/treatment/${treatment_uuid}/`,
    { params }
  );
  return response.data;
}

export async function getRecord(record_uuid: string): Promise<Record> {
  const response = await api.get(`/treatment-records/${record_uuid}/`);
  return response.data;
}

export async function createRecord(payload: RecordPayload): Promise<Record> {
  const response = await api.post(`/treatment-records/`, payload);
  return response.data;
}

export async function updateRecord(
  record_uuid: string,
  payload: RecordUpdatePayload
): Promise<Record> {
  const response = await api.patch(
    `/treatment-records/${record_uuid}/`,
    payload
  );
  return response.data;
}
