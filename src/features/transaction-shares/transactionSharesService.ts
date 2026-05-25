import api from "@/lib/axios";
import { paginatedResponseSchema } from "@/shared/types/api";
import { transactionShareSchema } from "./schemas/transactionShareSchema";
import type {
    TransactionShareCreate,
    TransactionShareUpdate,
    TransactionShareFilters,
} from "./types";

export const transactionSharesApi = {
    list: async (filters?: TransactionShareFilters & { page?: number }) => {
        const res = await api.get("/api/transaction-shares/", {
            params: filters,
        });
        return paginatedResponseSchema(transactionShareSchema).parse(res.data);
    },

    getById: async (id: number) => {
        const res = await api.get(`/api/transaction-shares/${id}/`);
        return transactionShareSchema.parse(res.data);
    },

    create: async (data: TransactionShareCreate) => {
        const res = await api.post("/api/transaction-shares/", data);
        return transactionShareSchema.parse(res.data);
    },

    patch: async (id: number, data: TransactionShareUpdate) => {
        const res = await api.patch(`/api/transaction-shares/${id}/`, data);
        return transactionShareSchema.parse(res.data);
    },

    remove: async (id: number) => {
        await api.delete(`/api/transaction-shares/${id}/`);
    },
};
