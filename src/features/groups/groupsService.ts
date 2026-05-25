import api from "@/lib/axios";
import { paginatedResponseSchema } from "@/shared/types/api";
import { groupSchema } from "./schemas/groupSchema";
import type { GroupCreate, GroupUpdate, GroupFilters } from "./types";

export const groupsApi = {
    list: async (filters?: GroupFilters & { page?: number }) => {
        const res = await api.get("/api/groups/", { params: filters });
        return paginatedResponseSchema(groupSchema).parse(res.data);
    },

    getById: async (id: string) => {
        const res = await api.get(`/api/groups/${id}/`);
        return groupSchema.parse(res.data);
    },

    create: async (data: GroupCreate) => {
        const res = await api.post("/api/groups/", data);
        return groupSchema.parse(res.data);
    },

    patch: async (id: string, data: GroupUpdate) => {
        const res = await api.patch(`/api/groups/${id}/`, data);
        return groupSchema.parse(res.data);
    },

    remove: async (id: string) => {
        await api.delete(`/api/groups/${id}/`);
    },
};
