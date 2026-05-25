import { z } from "zod";

export const categoryTypeSchema = z.enum(["income", "expense"]);

export const categorySchema = z.object({
    id: z.number(),
    user: z.number(),
    name: z.string(),
    type: categoryTypeSchema,
    color: z.string(),
    icon: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
});

export type Category = z.infer<typeof categorySchema>;
export type CategoryType = z.infer<typeof categoryTypeSchema>;
