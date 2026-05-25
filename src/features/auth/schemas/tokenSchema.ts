import { z } from "zod";

export const tokenResponseSchema = z.object({
    access: z.string().min(1, "Token access obrigatorio"),
    refresh: z.string().min(1, "Token refresh obrigatorio"),
});

export const refreshResponseSchema = tokenResponseSchema;

export type TokenResponse = z.infer<typeof tokenResponseSchema>;
export type RefreshResponse = z.infer<typeof refreshResponseSchema>;