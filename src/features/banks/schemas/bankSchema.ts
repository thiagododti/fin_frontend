import { z } from "zod";

export const bankSchema = z.object({
    id: z.number(),
    name: z.string(),
    code: z.string(),
    logo_url: z.string(),
    created_at: z.string(),
});

export type Bank = z.infer<typeof bankSchema>;
