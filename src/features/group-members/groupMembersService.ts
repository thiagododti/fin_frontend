import api from "@/lib/axios";
import { paginatedResponseSchema } from "@/shared/types/api";
import { groupMemberSchema } from "./schemas/groupMemberSchema";
import type {
    GroupMemberCreate,
    GroupMemberUpdate,
    GroupMemberFilters,
} from "./types";

export const groupMembersApi = {
    list: async (filters?: GroupMemberFilters & { page?: number }) => {
        const res = await api.get("/api/group-members/", { params: filters });
        return paginatedResponseSchema(groupMemberSchema).parse(res.data);
    },

    getById: async (id: string) => {
        const res = await api.get(`/api/group-members/${id}/`);
        return groupMemberSchema.parse(res.data);
    },

    create: async (data: GroupMemberCreate) => {
        const res = await api.post("/api/group-members/", data);
        return groupMemberSchema.parse(res.data);
    },

    patch: async (id: string, data: GroupMemberUpdate) => {
        const res = await api.patch(`/api/group-members/${id}/`, data);
        return groupMemberSchema.parse(res.data);
    },

    remove: async (id: string) => {
        await api.delete(`/api/group-members/${id}/`);
    },
};
