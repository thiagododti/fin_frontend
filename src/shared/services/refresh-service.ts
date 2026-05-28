import type { RefreshTokenType, Tokens } from '@/features/auth/types/Tokens';
import { baseApi } from '@/shared/api/base-client';
import { AUTH_ENDPOINTS } from '@/shared/constants/endpoints';
import { handleService } from '@/shared/utils/handle-service';

export async function refreshToken(data: RefreshTokenType) {
    return handleService(() => baseApi.post<Tokens>(AUTH_ENDPOINTS.REFRESH, data));
}
