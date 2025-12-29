import axios from "axios";
import { forceLogout } from "../utils/logout";

export const api = axios.create({
  baseURL: "http://localhost:8000/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response, 
  async error => {
    const originalRequest = error.config;

    if(error.response?.status == 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if(!refreshToken) {
        forceLogout();
        return Promise.reject(error);
      }

      try {
        const response = await api.post("/auth/refresh", {
          refresh_token: refreshToken,
        });

        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;

        localStorage.setItem("access_token", newAccessToken);
        localStorage.setItem("refresh_token", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch {
        forceLogout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
)
