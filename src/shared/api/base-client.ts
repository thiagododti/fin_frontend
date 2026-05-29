import axios from 'axios';
import { env } from '@/shared/api/env';

const { apiUrl } = env;

export const baseApi = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});
