import { z } from "zod";

export const creditCardSchema = z.object({
    id: z.number(),
    user: z.number(),
    bank: z.number().nullable(),
    name: z.string(),
    limit_amount: z.string(),
    closing_day: z.number(),
    due_day: z.number(),
    is_active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
});

export type CreditCard = z.infer<typeof creditCardSchema>;
