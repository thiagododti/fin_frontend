import { z } from "zod";

export const profileUserSchema = z.object({
    id: z.number(),
    username: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    birth_date: z.string().nullable(),
    photo: z.string().nullable(),
});

export type ProfileUser = z.infer<typeof profileUserSchema>;
