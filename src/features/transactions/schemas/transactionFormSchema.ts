import { z } from "zod";

export const transactionFormSchema = z.object({
    type: z.enum(["income", "expense", "transfer"], {
        required_error: "Tipo é obrigatório",
    }),
    description: z
        .string()
        .min(1, "Descrição é obrigatória")
        .max(255, "Máximo 255 caracteres"),
    amount: z
        .string()
        .min(1, "Valor é obrigatório")
        .regex(/^\d+(\.\d{1,2})?$/, "Formato inválido (ex: 180.90)"),
    transaction_date: z
        .string()
        .min(1, "Data é obrigatória")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (AAAA-MM-DD)"),
    status: z.enum(["pending", "paid", "cancelled"], {
        required_error: "Status é obrigatório",
    }),
    account: z.number().nullable().optional(),
    credit_card: z.number().nullable().optional(),
    category: z.number().nullable().optional(),
    notes: z.string().optional(),
});

export type TransactionFormData = z.infer<typeof transactionFormSchema>;

export const defaultValues: TransactionFormData = {
    type: "expense",
    description: "",
    amount: "",
    transaction_date: "",
    status: "pending",
    account: null,
    credit_card: null,
    category: null,
    notes: "",
};
