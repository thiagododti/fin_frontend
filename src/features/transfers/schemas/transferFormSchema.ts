import { z } from "zod";

export const transferFormSchema = z
    .object({
        source_account: z
            .number({ required_error: "Conta de origem é obrigatória" })
            .int()
            .positive("Conta de origem inválida"),
        destination_account: z
            .number({ required_error: "Conta de destino é obrigatória" })
            .int()
            .positive("Conta de destino inválida"),
        amount: z
            .string()
            .min(1, "Valor é obrigatório")
            .regex(/^\d+(\.\d{1,2})?$/, "Formato inválido (ex: 300.00)"),
        transfer_date: z
            .string()
            .min(1, "Data é obrigatória")
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (AAAA-MM-DD)"),
        description: z
            .string()
            .min(1, "Descrição é obrigatória")
            .max(255, "Máximo 255 caracteres"),
    })
    .refine((data) => data.source_account !== data.destination_account, {
        message: "Conta de origem e destino devem ser diferentes",
        path: ["destination_account"],
    });

export type TransferFormData = z.infer<typeof transferFormSchema>;

export const defaultValues: TransferFormData = {
    source_account: 0,
    destination_account: 0,
    amount: "",
    transfer_date: "",
    description: "",
};
