import { z } from "zod";

export const userSchema = z.object({
    id: z.number(),
    last_login: z.string().nullable(),
    is_superuser: z.boolean(),
    username: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    is_staff: z.boolean(),
    is_active: z.boolean(),
    date_joined: z.string(),
    birth_date: z.string().nullable(),
    photo: z.string().nullable(),
});

export type User = z.infer<typeof userSchema>;
