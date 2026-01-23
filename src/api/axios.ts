import axios from "axios";
// import { forceLogout } from "../utils/logout";
import { useAuth } from "../auth/AuthContext";
import { getCookie } from "../utils/getCoockie";

const apiUrl = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

let isLoggingOut = false;

api.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase();

  if (method && ["post", "put", "patch", "delete"].includes(method)) {
    // const csrfToken = getCookie("csrf_token");
    const csrfToken = localStorage.getItem('csrf_token')

    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    const isAuthEndpoint =
      url?.includes("/auth/login") ||
      url?.includes("/users/me") ||
      url?.includes("/auth/logout");

    if (status === 401 && !url?.includes(isAuthEndpoint)) {
      if (!isLoggingOut) {
        isLoggingOut = true;
        useAuth().forceLogout();
        // window.location.href = "/login";

        // try {
        //   await api.post("/auth/logout");
        // } catch {}
      }
      return Promise.reject(error);
    }
  },
);

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const response = await api.post("/auth/refresh/");

//         const newAccessToken = response.data.access_token;
//         localStorage.setItem("access_token", newAccessToken);

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//         return api(originalRequest);
//       } catch (refreshError) {
//         forceLogout();
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   },
// );
