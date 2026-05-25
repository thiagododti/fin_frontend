import { z } from "zod";

export const transactionShareStatusSchema = z.enum([
    "pending",
    "partially_paid",
    "paid",
    "cancelled",
]);

export const transactionShareSchema = z.object({
    id: z.number(),
    transaction: z.number(),
    group_member: z.string().uuid(),
    amount: z.string(),
    status: transactionShareStatusSchema,
    created_at: z.string(),
    updated_at: z.string(),
});

export type TransactionShare = z.infer<typeof transactionShareSchema>;
export type TransactionShareStatus = z.infer<
    typeof transactionShareStatusSchema
>;
