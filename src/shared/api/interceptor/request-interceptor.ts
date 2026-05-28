import type { InternalAxiosRequestConfig } from 'axios';
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

export async function requestInterceptor(
    config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> {
    let accessToken = getAccessToken();

    if (!accessToken) {
        return config;
    }

    if (isTokenExpired(accessToken)) {
        // Já existe um refresh em andamento — entra na fila e aguarda
        if (isRefreshInProgress()) {
            const newToken = await waitForRefresh();
            if (newToken) {
                config.headers.Authorization = `Bearer ${newToken}`;
            }
            return config;
        }

        const refresh = getRefreshToken();

        if (!refresh || isTokenExpired(refresh)) {
            await logoutService();
            return config;
        }

        startRefresh();

        try {
            const newTokens = await refreshToken({ refresh });
            setTokens(newTokens);
            resolveRefresh(newTokens.access); // libera a fila com o novo token
            accessToken = newTokens.access;
        } catch {
            failRefresh(); // libera a fila com null
            await logoutService();
            return config;
        }
    }

    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
}
