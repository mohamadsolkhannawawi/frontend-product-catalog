import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
    // Stateless Bearer token auth - no credentials needed
    withCredentials: false,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request Interceptor - Add Bearer Token untuk authenticated requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("auth_token");
            window.location.href = "/login";
            return Promise.reject(error);
        }

        // Show toast for other errors (network or server)
        const msg =
            error.response?.data?.message ||
            error.message ||
            "Terjadi kesalahan pada server";
        try {
            toast.error(msg);
        } catch {
            /* ignore if toast not available */
        }

        return Promise.reject(error);
    }
);

export default api;
