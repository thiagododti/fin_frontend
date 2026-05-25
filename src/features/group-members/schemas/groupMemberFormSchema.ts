import { z } from "zod";

export const groupMemberFormSchema = z.object({
    group: z.string().uuid("Grupo é obrigatório"),
    user: z.number({ required_error: "Usuário é obrigatório" }),
    role: z.enum(["owner", "admin", "member"], {
        required_error: "Papel é obrigatório",
    }),
});

export const groupMemberEditFormSchema = z.object({
    role: z.enum(["owner", "admin", "member"], {
        required_error: "Papel é obrigatório",
    }),
});

export type GroupMemberFormData = z.infer<typeof groupMemberFormSchema>;
export type GroupMemberEditFormData = z.infer<typeof groupMemberEditFormSchema>;

export const defaultValues: GroupMemberFormData = {
    group: "",
    user: 0,
    role: "member",
};
