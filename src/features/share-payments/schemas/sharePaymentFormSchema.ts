import { z } from "zod";

export const sharePaymentFormSchema = z.object({
    transaction_share: z
        .number({ required_error: "Rateio é obrigatório" })
        .int()
        .positive("Rateio inválido"),
    amount: z
        .string()
        .min(1, "Valor é obrigatório")
        .regex(/^\d+(\.\d{1,2})?$/, "Formato inválido (ex: 50.00)"),
    payment_date: z
        .string()
        .min(1, "Data é obrigatória")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (AAAA-MM-DD)"),
    notes: z.string().optional(),
});

export type SharePaymentFormData = z.infer<typeof sharePaymentFormSchema>;

export const defaultValues: SharePaymentFormData = {
    transaction_share: 0,
    amount: "",
    payment_date: "",
    notes: "",
};
