import api from "@/lib/axios";
import { paginatedResponseSchema } from "@/shared/types/api";
import { transferSchema } from "./schemas/transferSchema";
import type { TransferCreate, TransferUpdate, TransferFilters } from "./types";

export const transfersApi = {
    list: async (filters?: TransferFilters & { page?: number }) => {
        const res = await api.get("/api/transfers/", { params: filters });
        return paginatedResponseSchema(transferSchema).parse(res.data);
    },

    getById: async (id: number) => {
        const res = await api.get(`/api/transfers/${id}/`);
        return transferSchema.parse(res.data);
    },

    create: async (data: TransferCreate) => {
        const res = await api.post("/api/transfers/", data);
        return transferSchema.parse(res.data);
    },

    patch: async (id: number, data: TransferUpdate) => {
        const res = await api.patch(`/api/transfers/${id}/`, data);
        return transferSchema.parse(res.data);
    },

    remove: async (id: number) => {
        await api.delete(`/api/transfers/${id}/`);
    },
};
