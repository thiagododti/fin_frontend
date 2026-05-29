import { AxiosError } from 'axios';
import type { AppError } from '@/shared/types/AppError';
import type { ResponseError } from '@/shared/types/ResponseError';

export function normalizeApiError(error: unknown): AppError {
    if (error instanceof AxiosError) {
        const status = error.response?.status ?? 500;

        const data = error.response?.data as ResponseError;

        return {
            status,
            message: data?.detail ?? 'Erro inesperado',
            code: data?.code,
        };
    }

    return {
        message: 'Erro inesperado',
        status: 500,
    };
}
