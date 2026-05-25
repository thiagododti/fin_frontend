import { z } from "zod";

export const bankFormSchema = z.object({
    name: z
        .string()
        .min(1, "Nome é obrigatório")
        .max(150, "Máximo 150 caracteres"),
    code: z
        .string()
        .min(1, "Código é obrigatório")
        .max(20, "Máximo 20 caracteres"),
    logo_url: z.string().optional(),
});

export type BankFormData = z.infer<typeof bankFormSchema>;

export const defaultValues: BankFormData = {
    name: "",
    code: "",
    logo_url: "",
};
