import { z } from "zod";

export const changePasswordSchema = z
    .object({
        current_password: z.string().min(1, "Senha atual é obrigatória"),
        new_password: z
            .string()
            .min(6, "A nova senha deve ter pelo menos 6 caracteres"),
        confirm_password: z.string().min(1, "Confirme a nova senha"),
    })
    .refine((d) => d.new_password === d.confirm_password, {
        message: "As senhas não coincidem",
        path: ["confirm_password"],
    });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
