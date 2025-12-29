import { api } from "./axios";

interface LoginPayload {
  username: string;
  password: string;
}

export async function login(data: LoginPayload) {
  const params = new URLSearchParams();
  params.append("username", data.username);
  params.append("password", data.password);
  const response = await api.post("/auth/login/", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data;
}
