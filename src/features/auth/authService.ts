import { api } from "@/lib/axios";
import type { LoginCredentials, TokenResponse, RefreshResponse } from "./types";
import {
    tokenResponseSchema,
    refreshResponseSchema,
} from "@/features/auth/schemas/tokenSchema";

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
        const res = await api.post("/api/token/", credentials);
        return tokenResponseSchema.parse(res.data);
    },

    refresh: async (refresh: string): Promise<RefreshResponse> => {
        const res = await api.post("/api/token/refresh/", { refresh });
        return refreshResponseSchema.parse(res.data);
    },

    // Respostas intencionalmente ignoradas (fire-and-forget) — sem parse Zod
    verify: (token: string) => api.post("/api/token/verify/", { token }),

    blacklist: (refresh: string) =>
        api.post("/api/token/blacklist/", { refresh }),
};
