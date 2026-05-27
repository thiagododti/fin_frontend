export const AUTH_ENDPOINTS = {
    LOGIN: 'token/',
    BLACKLIST: 'token/blacklist/',
    REFRESH: 'token/refresh/',
    VERIFY: 'token/verify/',
};

export const USER_ENDPOINTS = {
    ME: 'users/me/',
    USERS: 'users/',
    USERS_DETAIL: (id: number) => `users/${id}/`,
    CHANGE_PASSWORD: 'users/change-password/',
};
