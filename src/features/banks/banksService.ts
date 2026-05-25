import api from "@/lib/axios";
import { paginatedResponseSchema } from "@/shared/types/api";
import { bankSchema } from "./schemas/bankSchema";
import type { BankCreate, BankUpdate, BankFilters } from "./types";

export const banksApi = {
    list: async (filters?: BankFilters & { page?: number }) => {
        const res = await api.get("/api/banks/", { params: filters });
        return paginatedResponseSchema(bankSchema).parse(res.data);
    },

    getById: async (id: number) => {
        const res = await api.get(`/api/banks/${id}/`);
        return bankSchema.parse(res.data);
    },

    create: async (data: BankCreate) => {
        const res = await api.post("/api/banks/", data);
        return bankSchema.parse(res.data);
    },

    patch: async (id: number, data: BankUpdate) => {
        const res = await api.patch(`/api/banks/${id}/`, data);
        return bankSchema.parse(res.data);
    },

    remove: async (id: number) => {
        await api.delete(`/api/banks/${id}/`);
    },
};
