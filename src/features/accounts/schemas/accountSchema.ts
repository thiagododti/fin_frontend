import { z } from "zod";

export const accountTypeSchema = z.enum([
    "checking",
    "savings",
    "cash",
    "investment",
    "wallet",
]);

export const accountSchema = z.object({
    id: z.number(),
    user: z.number(),
    bank: z.number().nullable(),
    name: z.string(),
    account_type: accountTypeSchema,
    initial_balance: z.string(),
    is_active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
});

export type Account = z.infer<typeof accountSchema>;
export type AccountType = z.infer<typeof accountTypeSchema>;
