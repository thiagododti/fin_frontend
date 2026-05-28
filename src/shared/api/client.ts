import axios from 'axios';
import { env } from '@/shared/api/env';
import { requestInterceptor } from '@/shared/api/interceptor/request-interceptor';
import { responseInterceptor } from './interceptor/response-interceptor';

const { apiUrl } = env;

export const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

api.interceptors.request.use(requestInterceptor);

api.interceptors.response.use(response => response, responseInterceptor);