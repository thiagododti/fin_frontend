import { z } from "zod";

export const sharePaymentSchema = z.object({
    id: z.number(),
    transaction_share: z.number(),
    amount: z.string(),
    payment_date: z.string(),
    notes: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
});

export type SharePayment = z.infer<typeof sharePaymentSchema>;
