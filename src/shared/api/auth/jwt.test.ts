import { describe, expect, it } from 'vitest';
import { decodeJwt, isTokenExpired } from '@/shared/api/auth/jwt';
import type { TokenBody } from '@/features/auth/types/Tokens';

function createFakeJwt(payload: object) {
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

    return `${encodedHeader}.${encodedPayload}.fake-signature`;
}

describe('Teste de decodeJwt', () => {
    it('Deve decodificar um JWT válido', () => {
        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MDA1ODgwNiwiaWF0IjoxNzc5OTcyNDA2LCJqdGkiOiIzNjIyMmY2YjVmMzk0Yzk0OWQzM2M4NWIyZDk5MGY3MiIsInVzZXJfaWQiOiIxIn0.kl5GEwW_56E8vtsjbfJhYC4giTmAjxJQMhWo0nwXXUs';

        const result = decodeJwt(token);

        expect(result?.exp).toBeDefined();
    });
    it('Deve retornar undefined para um JWT inválido', () => {
        const token = 'token_invalido';

        const result = decodeJwt(token);
        expect(result).toBeUndefined();
    });
});

const expiredTokenBody: TokenBody = {
    exp: Math.floor(Date.now() / 1000) - 10, // Token expirado há 10 segundos
    user_id: '1',
    token_type: 'access',
    iat: Math.floor(Date.now() / 1000) - 3600, // Emitido há 1 hora
    jti: '1234567890',
};
const expiredToken = createFakeJwt(expiredTokenBody);

const validTokenBody: TokenBody = {
    exp: Math.floor(Date.now() / 1000) + 300, // Token válido por mais 300 segundos
    user_id: '1',
    token_type: 'refresh',
    iat: Math.floor(Date.now() / 1000) - 3600, // Emitido há 1 hora
    jti: '1234567890',
};
const validToken = createFakeJwt(validTokenBody);

describe('Teste de isTokenExpired', () => {
    it('Deve retornar true para um token expirado', () => {
        const result = isTokenExpired(expiredToken);
        expect(result).toBe(true);
    });

    it('Deve retornar false para um token válido', () => {
        const result = isTokenExpired(validToken);
        expect(result).toBe(false);
    });

    it('Deve retornar true para um token inválido', () => {
        const result = isTokenExpired('token_invalido');
        expect(result).toBe(true);
    });
});
