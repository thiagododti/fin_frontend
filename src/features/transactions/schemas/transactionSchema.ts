import { z } from "zod";

export const transactionTypeSchema = z.enum(["income", "expense", "transfer"]);
export const transactionStatusSchema = z.enum(["pending", "paid", "cancelled"]);

export const transactionSchema = z.object({
    id: z.number(),
    user: z.number(),
    account: z.number().nullable(),
    credit_card: z.number().nullable(),
    category: z.number().nullable(),
    type: transactionTypeSchema,
    description: z.string(),
    amount: z.string(),
    transaction_date: z.string(),
    status: transactionStatusSchema,
    notes: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
});

export type Transaction = z.infer<typeof transactionSchema>;
export type TransactionType = z.infer<typeof transactionTypeSchema>;
export type TransactionStatus = z.infer<typeof transactionStatusSchema>;
