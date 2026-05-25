import api from "@/lib/axios";
import { paginatedResponseSchema } from "@/shared/types/api";
import { transactionSchema } from "./schemas/transactionSchema";
import type {
    TransactionCreate,
    TransactionUpdate,
    TransactionFilters,
} from "./types";

export const transactionsApi = {
    list: async (filters?: TransactionFilters & { page?: number }) => {
        const res = await api.get("/api/transactions/", { params: filters });
        return paginatedResponseSchema(transactionSchema).parse(res.data);
    },

    getById: async (id: number) => {
        const res = await api.get(`/api/transactions/${id}/`);
        return transactionSchema.parse(res.data);
    },

    create: async (data: TransactionCreate) => {
        const res = await api.post("/api/transactions/", data);
        return transactionSchema.parse(res.data);
    },

    patch: async (id: number, data: TransactionUpdate) => {
        const res = await api.patch(`/api/transactions/${id}/`, data);
        return transactionSchema.parse(res.data);
    },

    remove: async (id: number) => {
        await api.delete(`/api/transactions/${id}/`);
    },
};
