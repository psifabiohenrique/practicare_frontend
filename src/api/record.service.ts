import { api } from "./axios";
import type { PaginatedResponse } from "../types/pagination";
import type {
  Record,
  RecordUpdatePayload,
  RecordPayload,
  RecordListParams,
} from "../types/record";

export async function listRecords(
  treatment_uuid: string,
  params?: RecordListParams,
): Promise<PaginatedResponse<Record>> {
  const response = await api.get<PaginatedResponse<Record>>(
    `/treatment-records/treatment/${treatment_uuid}`,
    { params },
  );
  return response.data;
}

export async function getRecord(record_uuid: string): Promise<Record> {
  const response = await api.get(`/treatment-records/${record_uuid}`);
  return response.data;
}

export async function createRecord(payload: RecordPayload): Promise<Record> {
  const response = await api.post(`/treatment-records`, payload);
  return response.data;
}

export async function updateRecord(
  record_uuid: string,
  payload: RecordUpdatePayload,
): Promise<Record> {
  const response = await api.patch(
    `/treatment-records/${record_uuid}`,
    payload,
  );
  return response.data;
}

export async function deleteRecord(record_uuid: string): Promise<void> {
  await api.delete(`/treatment-records/${record_uuid}`);
}

export async function startAutomatedRecordUpload(
  treatment_uuid: string,
  session_date: string,
): Promise<{ record: Record; job_uuid: string }> {
  const response = await api.post(
    `/treatment-records/treatments/${treatment_uuid}/automated-record`,
    { session_date },
  );
  return response.data;
}

export async function startAutomatedRecordReload(
  record_uuid: string,
): Promise<{ record: Record; job_uuid: string }> {
  const response = await api.post(
    `/treatment-records/treatments/${record_uuid}/automated-record-reload`,
  );
  return response.data;
}

export async function uploadAudioChunk(
  job_uuid: string,
  chunkIndex: number,
  chunk: Blob,
): Promise<void> {
  const formData = new FormData();
  formData.append("audio_file", chunk);
  await api.post(
    `/treatment-records/automated-record/${job_uuid}/chunk?chunk_index=${chunkIndex}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
}

export async function finalizeAutomatedRecordUpload(
  job_uuid: string,
  totalChunks: number,
): Promise<void> {
  await api.post(
    `/treatment-records/automated-record/${job_uuid}/finalize?total_chunks=${totalChunks}`,
  );
}

export async function uploadInChunks(
  job_uuid: string,
  fullBlob: Blob,
  onProgress?: (progress: number) => void,
): Promise<void> {
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
  const totalChunks = Math.ceil(fullBlob.size / CHUNK_SIZE);

  const uploadPromises = Array.from({ length: totalChunks }, (_, i) => {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, fullBlob.size);
    const chunk = fullBlob.slice(start, end);

    return uploadAudioChunk(job_uuid, i, chunk).then(() => {
      if (onProgress) {
        onProgress(((i + 1) / totalChunks) * 100);
      }
    });
  });

  await Promise.all(uploadPromises);
  await finalizeAutomatedRecordUpload(job_uuid, totalChunks);
}

export async function submitAutomatedRecord(
  treatment_uuid: string,
  formData: FormData,
): Promise<void> {
  await api.post(
    `/treatment-records/treatments/${treatment_uuid}/automated-record`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
}

export async function reuploadAutomatedRecord(
  record_uuid: string,
  formData: FormData,
): Promise<void> {
  await api.post(
    `/treatment-records/treatments/${record_uuid}/automated-record-reload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
}
