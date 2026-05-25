import { z } from "zod";

export const transactionShareFormSchema = z.object({
    transaction: z
        .number({ required_error: "Transação é obrigatória" })
        .int()
        .positive("Transação inválida"),
    group_member: z
        .string({ required_error: "Membro é obrigatório" })
        .uuid("UUID inválido"),
    amount: z
        .string()
        .min(1, "Valor é obrigatório")
        .regex(/^\d+(\.\d{1,2})?$/, "Formato inválido (ex: 90.45)"),
    status: z.enum(["pending", "partially_paid", "paid", "cancelled"], {
        required_error: "Status é obrigatório",
    }),
});

export type TransactionShareFormData = z.infer<
    typeof transactionShareFormSchema
>;

export const defaultValues: TransactionShareFormData = {
    transaction: 0,
    group_member: "",
    amount: "",
    status: "pending",
};
