import type { RegisterPayload, UpdatePayload } from "../types/user";
import { api } from "./axios";

export async function register(data: RegisterPayload) {
  const response = await api.post("/users", data);
  return response.data;
}

export async function update(uuid: string, data: UpdatePayload) {
  const response = await api.patch(`/users/${uuid}`, data);
  return response.data;
}

export async function getMe() {
  const response = await api.get("/users/me");
  return response.data;
}

export async function healthChecker() {
  const response = await api.get("/");
  return response;
}
