import { api } from '@/shared/api/client';
import { baseApi } from '@/shared/api/base-client';
import type { Login } from '@/features/auth/types/Login';
import { AUTH_ENDPOINTS } from '@/shared/constants/endpoints';
import { handleService } from '@/shared/utils/handle-service';
import type { RefreshTokenType, Tokens } from '@/features/auth/types/Tokens';

export function login(data: Login) {
    return handleService(() => baseApi.post<Tokens>(AUTH_ENDPOINTS.LOGIN, data));
}

export function logout(data: RefreshTokenType) {
    return handleService(() => baseApi.post(AUTH_ENDPOINTS.BLACKLIST, data));
}
