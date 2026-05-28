import type { RefreshToken, Tokens } from "@/features/auth/types/Tokens";
import { baseApi } from "@/shared/api/base-client";
import { AUTH_ENDPOINTS } from "@/shared/constants/endpoints";

export async function refreshToken(
    refresh: RefreshToken
) {
    const response = await baseApi.post<Tokens>(AUTH_ENDPOINTS.REFRESH, { refresh });
    return response.data;
}