import { z } from "zod";

export const userFormSchema = z
    .object({
        username: z.string().min(1, "Usuário é obrigatório"),
        email: z
            .union([z.string().email("Email inválido"), z.literal("")])
            .optional(),
        first_name: z.string().optional().default(""),
        last_name: z.string().optional().default(""),
        telephone: z.string().optional().default(""),
        birthday: z.string().optional().default(""),
        department: z.number().optional(),
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

export const defaultValues: UserFormData = {
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    telephone: "",
    birthday: "",
    department: undefined,
    is_active: true,
    is_staff: false,
    is_superuser: false,
    password: "",
    password2: "",
};

export interface UserEditData {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    telephone?: string | null;
    birthday?: string | null;
    department?: number | null;
    is_active?: boolean;
    is_staff?: boolean;
    is_superuser?: boolean;
    photo?: string | null;
}
