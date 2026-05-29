import { describe, expect, it } from 'vitest';
import { decodeJwt, isTokenExpired } from '@/shared/api/auth/jwt';
import type { TokenBody } from '@/features/auth/types/Tokens';
import { createFakeJwt } from '@/shared/utils/create-fake-jwt';

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

const expiredToken = createFakeJwt(0);

const validToken = createFakeJwt(300);

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
