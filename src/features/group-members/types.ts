export type { GroupMember, GroupMemberRole } from "./schemas/groupMemberSchema";

export interface GroupMemberCreate {
    group: string;
    user: number;
    role: "owner" | "admin" | "member";
}

export interface GroupMemberUpdate {
    role?: "owner" | "admin" | "member";
}

export interface GroupMemberFilters {
    group?: string;
    user?: number;
    role?: string;
    [key: string]: unknown;
}
