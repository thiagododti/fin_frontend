import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import { env } from "@/config/env";
import { isTokenExpired } from "./jwt";
import { tokenStore } from "./tokenStore";
import { refreshResponseSchema } from "@/features/auth/schemas/tokenSchema";

const api = axios.create({
    baseURL: env.VITE_API_BASE_URL,
});

let isRefreshing = false;
let failedQueue: {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else if (token) prom.resolve(token);
    });
    failedQueue = [];
};

const AUTH_ENDPOINTS = [
    "/api/token/",
    "/api/token/refresh/",
    "/api/token/verify/",
];

const isAuthEndpointRequest = (requestUrl?: string) => {
    if (!requestUrl) return false;
    return AUTH_ENDPOINTS.some((endpoint) => requestUrl.endsWith(endpoint));
};

api.interceptors.request.use((config) => {
    const token = tokenStore.getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (!originalRequest) {
            return Promise.reject(error);
        }

        if (
            error.response?.status === 401 &&
            isAuthEndpointRequest(originalRequest.url)
        ) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = tokenStore.getRefreshToken();

            if (!refreshToken || isTokenExpired(refreshToken)) {
                processQueue(error, null);
                isRefreshing = false;
                tokenStore.clear();
                window.dispatchEvent(new CustomEvent("auth:session-expired"));
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(
                    `${env.VITE_API_BASE_URL}/api/token/refresh/`,
                    { refresh: refreshToken },
                );
                const data = refreshResponseSchema.parse(response.data);
                tokenStore.setAccessToken(data.access);
                tokenStore.setRefreshToken(data.refresh);
                processQueue(null, data.access);
                originalRequest.headers.Authorization = `Bearer ${data.access}`;
                window.dispatchEvent(
                    new CustomEvent("auth:token-refreshed", {
                        detail: { access: data.access, refresh: data.refresh },
                    }),
                );
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                tokenStore.clear();
                window.dispatchEvent(new CustomEvent("auth:session-expired"));
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    },
);

export { api };
