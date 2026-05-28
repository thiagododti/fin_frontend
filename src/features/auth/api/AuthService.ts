import { api } from '@/shared/api/client';
import type { Login } from '@/features/auth/types/Login';
import type { Tokens } from '@/features/auth/types/Tokens';
import { AUTH_ENDPOINTS } from '@/shared/constants/endpoints';
import { handleService } from '@/shared/utils/handle-service';

export async function login(data: Login) {
    return handleService(() => api.post<Tokens>(AUTH_ENDPOINTS.LOGIN, data));
}
