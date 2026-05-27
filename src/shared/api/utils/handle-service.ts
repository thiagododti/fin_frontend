import { normalizeApiError } from '@/shared/utils/normalize-api-error';
import type { AxiosResponse } from 'axios';

export async function handleService<T>(callback: Promise<AxiosResponse<T>>): Promise<T> {
    try {
        const response = await callback;
        return response.data;
    } catch (error) {
        throw normalizeApiError(error);
    }
}
