import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "../categoriesService";
import { categoryKeys } from "../categories.keys";
import type { CategoryFilters, CategoryCreate, CategoryUpdate } from "../types";

export function useCategories(filters?: CategoryFilters, page = 1) {
    return useQuery({
        queryKey: categoryKeys.list(filters, page),
        queryFn: () => categoriesApi.list({ ...filters, page }),
    });
}

export function useCategory(id: number) {
    return useQuery({
        queryKey: categoryKeys.detail(id),
        queryFn: () => categoriesApi.getById(id),
        enabled: !!id,
    });
}

export function useCreateCategory() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CategoryCreate) => categoriesApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all() }),
    });
}

export function useUpdateCategory() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: CategoryUpdate }) =>
            categoriesApi.patch(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all() }),
    });
}

export function useDeleteCategory() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => categoriesApi.remove(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all() }),
    });
}
