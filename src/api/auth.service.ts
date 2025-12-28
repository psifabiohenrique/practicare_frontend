import { api } from "./axios";

interface LoginPayload {
  email: string;
  password: string;
}

export async function login(data: LoginPayload) {
  const response = await api.post("/auth/login/", data);
  return response.data;
}
