import { z } from "zod";

export const userFormSchema = z
    .object({
        username: z.string().min(1, "Usuário é obrigatório"),
        email: z
            .union([z.string().email("Email inválido"), z.literal("")])
            .optional(),
        first_name: z.string().optional().default(""),
        last_name: z.string().optional().default(""),
        birth_date: z.string().optional().default(""),
        is_active: z.boolean(),
        is_staff: z.boolean(),
        is_superuser: z.boolean(),
        password: z.string().optional(),
        password2: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.password) return data.password === data.password2;
            return true;
        },
        { message: "As senhas não coincidem", path: ["password2"] },
    );

export type UserFormData = z.infer<typeof userFormSchema>;

export type { UserEditData } from "../types";

export const defaultValues: UserFormData = {
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    birth_date: "",
    is_active: true,
    is_staff: false,
    is_superuser: false,
    password: "",
    password2: "",
};
