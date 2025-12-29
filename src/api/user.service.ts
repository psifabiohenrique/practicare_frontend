import type { RegisterPayload, UpdatePayload } from "../types/user";
import { api } from "./axios";


export async function register(data: RegisterPayload) {
    const response = await api.post("/users", data);
    return response.data;
}

export async function update(id: number, data: UpdatePayload) {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
}

export async function getMe() {
    const response = await api.get("/users/me");
    return response.data;
}
