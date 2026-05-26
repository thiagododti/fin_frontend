import { api } from "@/lib/axios";
import type { UserCreate, UserUpdate, UserFilters } from "./types";
import { paginatedResponseSchema } from "@/shared/types/api";
import { userSchema } from "./schemas/userSchema";

function buildUserFormData(data: UserCreate | UserUpdate): FormData {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value instanceof File ? value : String(value));
        }
    });
    return formData;
}

export const usersApi = {
    list: async (filters?: UserFilters & { page?: number }) => {
        const res = await api.get("/api/users/", { params: filters });
        return paginatedResponseSchema(userSchema).parse(res.data);
    },

    getById: async (id: number) => {
        const res = await api.get(`/api/users/${id}/`);
        return userSchema.parse(res.data);
    },

    create: async (data: UserCreate) => {
        const res = await api.post("/api/users/", buildUserFormData(data), {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return userSchema.parse(res.data);
    },

    patch: async (id: number, data: UserUpdate) => {
        const res = await api.patch(
            `/api/users/${id}/`,
            buildUserFormData(data),
            {
                headers: { "Content-Type": "multipart/form-data" },
            },
        );
        return userSchema.parse(res.data);
    },
};
