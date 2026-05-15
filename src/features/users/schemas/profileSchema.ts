import { z } from "zod";

export const profileSchema = z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    birth_date: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
