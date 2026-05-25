import { z } from "zod";

export const groupSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    owner_user: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
});

export type Group = z.infer<typeof groupSchema>;
