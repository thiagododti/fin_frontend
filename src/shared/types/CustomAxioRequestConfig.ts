import type { InternalAxiosRequestConfig } from 'axios';

export type CustomAxiosRequestConfig =
    InternalAxiosRequestConfig & {
        _retry?: boolean;
    };