import api from "@/lib/axios";
import { paginatedResponseSchema } from "@/shared/types/api";
import { categorySchema } from "./schemas/categorySchema";
import type { CategoryCreate, CategoryUpdate, CategoryFilters } from "./types";

export const categoriesApi = {
    list: async (filters?: CategoryFilters & { page?: number }) => {
        const res = await api.get("/api/categories/", { params: filters });
        return paginatedResponseSchema(categorySchema).parse(res.data);
    },

    getById: async (id: number) => {
        const res = await api.get(`/api/categories/${id}/`);
        return categorySchema.parse(res.data);
    },

    create: async (data: CategoryCreate) => {
        const res = await api.post("/api/categories/", data);
        return categorySchema.parse(res.data);
    },

    patch: async (id: number, data: CategoryUpdate) => {
        const res = await api.patch(`/api/categories/${id}/`, data);
        return categorySchema.parse(res.data);
    },

    remove: async (id: number) => {
        await api.delete(`/api/categories/${id}/`);
    },
};
