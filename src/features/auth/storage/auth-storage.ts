import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/features/auth/constants/auth-keys';
import type { Tokens } from '@/features/auth/types/Tokens';

export function setTokens({ access, refresh }: Tokens) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}
