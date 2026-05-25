import api from "@/lib/axios";
import { paginatedResponseSchema } from "@/shared/types/api";
import { creditCardSchema } from "./schemas/creditCardSchema";
import type {
    CreditCardCreate,
    CreditCardUpdate,
    CreditCardFilters,
} from "./types";

export const creditCardsApi = {
    list: async (filters?: CreditCardFilters & { page?: number }) => {
        const res = await api.get("/api/credit-cards/", { params: filters });
        return paginatedResponseSchema(creditCardSchema).parse(res.data);
    },

    getById: async (id: number) => {
        const res = await api.get(`/api/credit-cards/${id}/`);
        return creditCardSchema.parse(res.data);
    },

    create: async (data: CreditCardCreate) => {
        const res = await api.post("/api/credit-cards/", data);
        return creditCardSchema.parse(res.data);
    },

    patch: async (id: number, data: CreditCardUpdate) => {
        const res = await api.patch(`/api/credit-cards/${id}/`, data);
        return creditCardSchema.parse(res.data);
    },

    remove: async (id: number) => {
        await api.delete(`/api/credit-cards/${id}/`);
    },
};
