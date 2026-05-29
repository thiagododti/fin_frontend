import { logout } from '@/features/auth/api/AuthService';
import { AUTH_BROADCAST_CHANNEL } from '@/features/auth/constants/auth-keys';
import { clearTokens, getRefreshToken } from '@/features/auth/storage/auth-storage';
import { queryClient } from '@/shared/lib/react-query/query-client';

const authChannel = new BroadcastChannel(AUTH_BROADCAST_CHANNEL);

let isLoggingOut = false;

export async function logoutService() {
    if (isLoggingOut) return;
    isLoggingOut = true;

    try {
        const refreshToken = getRefreshToken();

        if (refreshToken) {
            await logout({ refresh: refreshToken }).catch(() => {});
        }
        clearTokens();
        queryClient.clear();
        window.dispatchEvent(new Event('auth:logout'));
        authChannel.postMessage('logout');
    } finally {
        isLoggingOut = false;
    }
}
