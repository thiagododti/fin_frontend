import api from "@/lib/axios";
import { paginatedResponseSchema } from "@/shared/types/api";
import { accountSchema } from "./schemas/accountSchema";
import type { AccountCreate, AccountUpdate, AccountFilters } from "./types";

export const accountsApi = {
    list: async (filters?: AccountFilters & { page?: number }) => {
        const res = await api.get("/api/accounts/", { params: filters });
        return paginatedResponseSchema(accountSchema).parse(res.data);
    },

    getById: async (id: number) => {
        const res = await api.get(`/api/accounts/${id}/`);
        return accountSchema.parse(res.data);
    },

    create: async (data: AccountCreate) => {
        const res = await api.post("/api/accounts/", data);
        return accountSchema.parse(res.data);
    },

    patch: async (id: number, data: AccountUpdate) => {
        const res = await api.patch(`/api/accounts/${id}/`, data);
        return accountSchema.parse(res.data);
    },

    remove: async (id: number) => {
        await api.delete(`/api/accounts/${id}/`);
    },
};
