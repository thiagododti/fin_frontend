import type { TokenBody } from '@/features/auth/types/Tokens';
import { jwtDecode } from 'jwt-decode';

const TOKEN_EXPIRATION_BUFFER = 30; // 30 segundos

export function decodeJwt(token: string): TokenBody | undefined {
    try {
        return jwtDecode<TokenBody>(token);
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return undefined;
    }
}

export function isTokenExpired(token: string): boolean {
    const decodedToken = decodeJwt(token);
    if (!decodedToken?.exp) {
        return true;
    }

    // 30 segundos antes eu ja retorno ele como expirado, para evitar edge cases de expirar no meio do processo

    const currentTime = Math.floor(Date.now() / 1000);

    return currentTime >= decodedToken.exp - TOKEN_EXPIRATION_BUFFER;
}
