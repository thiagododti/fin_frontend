import { z } from "zod";

export const groupFormSchema = z.object({
    name: z
        .string()
        .min(1, "Nome é obrigatório")
        .max(150, "Máximo 150 caracteres"),
});

export type GroupFormData = z.infer<typeof groupFormSchema>;

export const defaultValues: GroupFormData = {
    name: "",
};
