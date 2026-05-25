import { z } from "zod";

export const accountFormSchema = z.object({
    name: z
        .string()
        .min(1, "Nome é obrigatório")
        .max(150, "Máximo 150 caracteres"),
    account_type: z.enum(
        ["checking", "savings", "cash", "investment", "wallet"],
        { required_error: "Tipo de conta é obrigatório" },
    ),
    bank: z.number().nullable().optional(),
    initial_balance: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "Formato inválido (ex: 1500.00)")
        .optional(),
    is_active: z.boolean().optional(),
});

export type AccountFormData = z.infer<typeof accountFormSchema>;

export const defaultValues: AccountFormData = {
    name: "",
    account_type: "checking",
    bank: null,
    initial_balance: "0.00",
    is_active: true,
};
