import axios from 'axios';
import { env } from '@/shared/api/env';
import { RequestInterceptor } from './interceptor/request-interceptor';

const { apiUrl } = env;

export const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

api.interceptors.request.use(RequestInterceptor);
