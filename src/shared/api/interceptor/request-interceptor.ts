import { type InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, setTokens } from '@/features/auth/storage/auth-storage';
import { isTokenExpired } from '@/shared/api/auth/jwt';
import { refreshToken } from '@/shared/services/refresh-service';
import { logoutService } from '@/shared/services/logout-service';
import {
    failRefresh,
    isRefreshInProgress,
    resolveRefresh,
    startRefresh,
    waitForRefresh,
} from '@/shared/api/auth/refresh-lock';
import { shouldConvertToFormData, toFormData } from '@/shared/helpers/form-data';

function transformRequestData(data: unknown): unknown {
    if (shouldConvertToFormData(data)) {
        return toFormData(data);
    }
    return data;
}

async function ensureValidToken(): Promise<string | null> {
    const accessToken = getAccessToken();

    if (!accessToken) {
        return null;
    }
    if (isTokenExpired(accessToken)) {
        if (isRefreshInProgress()) {
            const newToken = await waitForRefresh();
            if (newToken) {
                return newToken;
            }
            return null;
        }
        const refresh = getRefreshToken();

        if (!refresh || isTokenExpired(refresh)) {
            await logoutService();
            return null;
        }
        startRefresh();

        try {
            const newTokens = await refreshToken({ refresh });
            setTokens(newTokens);
            resolveRefresh(newTokens.access);
            return newTokens.access;
        } catch {
            failRefresh();
            await logoutService();
            return null;
        }
    }
    return accessToken;
}

export async function requestInterceptor(
    config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> {
    const accessToken = await ensureValidToken();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    config.data = transformRequestData(config.data);

    return config;
}
