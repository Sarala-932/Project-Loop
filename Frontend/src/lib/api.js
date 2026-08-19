import axios from "axios";
import {toast} from "react-toastify";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve();
    });
    failedQueue = [];
};

api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip interceptor logic if the request is an auth request
        if (originalRequest.url.includes('/auth/refresh') || originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/register')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({resolve, reject});
                })
                    .then(() => api(originalRequest))
                    .catch((err) => Promise.reject(err));
            }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, {withCredentials: true});
                isRefreshing = false;
                processQueue(null);
                return api(originalRequest);
            } catch (err) {
                isRefreshing = false;
                processQueue(err);
                if (typeof window !== "undefined") {
                    const publicPaths = ['/login', '/register', '/forgot-password', '/'];
                    if (!publicPaths.includes(window.location.pathname)) {
                        console.error("Token refresh failed. Redirecting to login.");
                        
                        // IMPORTANT: Clear localStorage state BEFORE redirecting!
                        // Otherwise, PublicRoute will see isAuthenticated=true and redirect BACK to dashboard, causing a loop!
                        import("../features/auth/store/authStore").then((module) => {
                            module.useAuthStore.getState().clearAuth();
                            setTimeout(() => {
                                window.location.href = "/login";
                            }, 500);
                        });
                    }
                }
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    },
);

