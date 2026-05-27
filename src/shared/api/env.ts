import type { ApiUrl } from '@/shared/api/type';

const apiUrl = import.meta.env.VITE_API_URL;
if (!apiUrl) {
    throw new Error('A variável de ambiente VITE_API_URL não está definida.');
}
export const env: ApiUrl = { apiUrl: apiUrl };
