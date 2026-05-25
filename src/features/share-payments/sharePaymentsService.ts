import api from "@/lib/axios";
import { paginatedResponseSchema } from "@/shared/types/api";
import { sharePaymentSchema } from "./schemas/sharePaymentSchema";
import type {
    SharePaymentCreate,
    SharePaymentUpdate,
    SharePaymentFilters,
} from "./types";

export const sharePaymentsApi = {
    list: async (filters?: SharePaymentFilters & { page?: number }) => {
        const res = await api.get("/api/share-payments/", { params: filters });
        return paginatedResponseSchema(sharePaymentSchema).parse(res.data);
    },

    getById: async (id: number) => {
        const res = await api.get(`/api/share-payments/${id}/`);
        return sharePaymentSchema.parse(res.data);
    },

    create: async (data: SharePaymentCreate) => {
        const res = await api.post("/api/share-payments/", data);
        return sharePaymentSchema.parse(res.data);
    },

    patch: async (id: number, data: SharePaymentUpdate) => {
        const res = await api.patch(`/api/share-payments/${id}/`, data);
        return sharePaymentSchema.parse(res.data);
    },

    remove: async (id: number) => {
        await api.delete(`/api/share-payments/${id}/`);
    },
};
