import type { InternalAxiosRequestConfig } from 'axios';
import { getAccessToken } from '@/features/auth/storage/auth-storage';

export function RequestInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const accessToken = getAccessToken();

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
}
