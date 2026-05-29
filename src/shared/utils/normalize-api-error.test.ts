import { normalizeApiError } from '@/shared/utils/normalize-api-error';
import { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { describe, expect, it } from 'vitest';

describe('normalizeApiError', () => {
    it('deve retornar erro com status e mensagem quando AxiosError com response', () => {
        const axiosError = new AxiosError('Erro da API', 'ERR_REQUEST');
        axiosError.response = {
            status: 404,
            data: { detail: 'Recurso não encontrado' },
            statusText: 'Not Found',
            headers: {},
            config: {} as InternalAxiosRequestConfig,
        };

        const resultado = normalizeApiError(axiosError);

        expect(resultado).toEqual({
            status: 404,
            message: 'Recurso não encontrado',
        });
    });

    it('deve retornar mensagem padrão quando detail não está disponível', () => {
        const axiosError = new AxiosError('Erro da API', 'ERR_REQUEST');
        axiosError.response = {
            status: 500,
            data: {},
            statusText: 'Internal Server Error',
            headers: {},
            config: {} as InternalAxiosRequestConfig,
        };

        const resultado = normalizeApiError(axiosError);

        expect(resultado).toEqual({
            status: 500,
            message: 'Erro inesperado',
        });
    });

    it('deve retornar status 500 quando response não existe', () => {
        const axiosError = new AxiosError('Erro de conexão', 'ERR_NETWORK');

        const resultado = normalizeApiError(axiosError);

        expect(resultado).toEqual({
            status: 500,
            message: 'Erro inesperado',
        });
    });

    it('deve retornar erro padrão para erros que não são AxiosError', () => {
        const erro = new Error('Erro genérico');

        const resultado = normalizeApiError(erro);

        expect(resultado).toEqual({
            status: 500,
            message: 'Erro inesperado',
        });
    });

    it('deve retornar erro padrão para unknown', () => {
        const resultado = normalizeApiError('erro desconhecido');

        expect(resultado).toEqual({
            status: 500,
            message: 'Erro inesperado',
        });
    });
});
