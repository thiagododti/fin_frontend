import { z } from "zod";

export const groupMemberRoleSchema = z.enum(["owner", "admin", "member"]);

export const groupMemberSchema = z.object({
    id: z.string().uuid(),
    group: z.string().uuid(),
    user: z.number(),
    role: groupMemberRoleSchema,
    created_at: z.string(),
});

export type GroupMember = z.infer<typeof groupMemberSchema>;
export type GroupMemberRole = z.infer<typeof groupMemberRoleSchema>;
