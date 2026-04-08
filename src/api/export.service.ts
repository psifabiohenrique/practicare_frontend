import { api } from "./axios";

export async function downloadBackup(): Promise<Blob> {
  const response = await api.get("/export/backup", {
    responseType: "blob",
  });
  return response.data;
}
