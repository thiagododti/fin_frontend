import { z } from "zod";

export const creditCardFormSchema = z.object({
    name: z
        .string()
        .min(1, "Nome é obrigatório")
        .max(150, "Máximo 150 caracteres"),
    bank: z.number().nullable().optional(),
    limit_amount: z
        .string()
        .min(1, "Limite é obrigatório")
        .regex(/^\d+(\.\d{1,2})?$/, "Formato inválido (ex: 5000.00)"),
    closing_day: z
        .number({ required_error: "Dia de fechamento é obrigatório" })
        .int()
        .min(1, "Deve ser entre 1 e 31")
        .max(31, "Deve ser entre 1 e 31"),
    due_day: z
        .number({ required_error: "Dia de vencimento é obrigatório" })
        .int()
        .min(1, "Deve ser entre 1 e 31")
        .max(31, "Deve ser entre 1 e 31"),
    is_active: z.boolean().optional(),
});

export type CreditCardFormData = z.infer<typeof creditCardFormSchema>;

export const defaultValues: CreditCardFormData = {
    name: "",
    bank: null,
    limit_amount: "0.00",
    closing_day: 1,
    due_day: 1,
    is_active: true,
};
