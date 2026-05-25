import { z } from "zod";

export const categoryFormSchema = z.object({
    name: z
        .string()
        .min(1, "Nome é obrigatório")
        .max(150, "Máximo 150 caracteres"),
    type: z.enum(["income", "expense"], {
        required_error: "Tipo é obrigatório",
    }),
    color: z.string().max(20, "Máximo 20 caracteres").optional(),
    icon: z.string().max(100, "Máximo 100 caracteres").optional(),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

export const defaultValues: CategoryFormData = {
    name: "",
    type: "expense",
    color: "",
    icon: "",
};
