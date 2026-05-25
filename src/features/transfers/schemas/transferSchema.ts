import { z } from "zod";

export const transferSchema = z.object({
    id: z.number(),
    user: z.number(),
    source_account: z.number(),
    destination_account: z.number(),
    amount: z.string(),
    transfer_date: z.string(),
    description: z.string(),
    created_at: z.string(),
});

export type Transfer = z.infer<typeof transferSchema>;
