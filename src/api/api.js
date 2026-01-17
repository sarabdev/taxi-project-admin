import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 15000,
});

/* -----------------------------
   REQUEST: attach admin token
------------------------------ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* -----------------------------
   RESPONSE: auto logout on 401
------------------------------ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Prevent redirect loop
      const isLoginPage = window.location.pathname === "/login";

      localStorage.removeItem("adminToken");

      if (!isLoginPage) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
