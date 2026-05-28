import type { AxiosError } from 'axios';
import { api } from '@/shared/api/client';
import {
    clearTokens,
    getRefreshToken,
    setTokens,
} from '@/features/auth/storage/auth-storage';
import type { CustomAxiosRequestConfig } from '@/shared/types/CustomAxioRequestConfig';
import { refreshToken } from '@/shared/services/refresh-service';



export async function responseInterceptor(
    error: AxiosError,
) {
    const originalRequest =
        error.config as CustomAxiosRequestConfig;

    if (
        error.response?.status !== 401 ||
        originalRequest._retry
    ) {
        return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
        const refresh = getRefreshToken();

        if (!refresh) {
            clearTokens();

            return Promise.reject(error);
        }

        const newTokens = await refreshToken({ refresh });

        setTokens(newTokens);

        originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;

        return api(originalRequest);
    } catch (refreshError) {
        clearTokens();

        return Promise.reject(refreshError);
    }
}