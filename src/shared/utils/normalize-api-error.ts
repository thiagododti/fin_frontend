import { AxiosError } from 'axios';
import type { AppError } from '@/shared/types/app-error';
import type { ErrorResponse } from '@/shared/types/ErrorResponse';

export function normalizeApiError(error: unknown): AppError {
    if (error instanceof AxiosError) {
        const status = error.response?.status || 500;

        const data = error.response?.data as ErrorResponse;

        return {
            status,
            message: data?.detail ?? 'Erro inesperado',
        };
    }

    return {
        message: 'Erro inesperado',
        status: 500,
    };
}
