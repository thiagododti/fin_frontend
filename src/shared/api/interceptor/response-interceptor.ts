import type { AxiosError } from 'axios';
import { logoutService } from '@/shared/services/logout-service';

export async function responseInterceptor(error: AxiosError) {
    if (error.response?.status === 401) {
        await logoutService();
    }

    // Repassa o erro para quem chamou a requisição tratar normalmente.
    return Promise.reject(error);
}
