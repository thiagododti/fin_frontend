import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../usersService";
import { userKeys } from "../users.keys";
import type { UserFilters, UserCreate, UserUpdate } from "../types";

// ─── Users ────────────────────────────────────────────────────────────────────

export function useUsers(filters?: UserFilters, page = 1) {
    return useQuery({
        queryKey: userKeys.list(filters, page),
        queryFn: () =>
            usersApi.list({ ...filters, page }).then((res) => res.data),
    });
}

export function useUser(id: number) {
    return useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => usersApi.getById(id).then((res) => res.data),
        enabled: !!id,
    });
}

export function useCreateUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: UserCreate) => usersApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all() }),
    });
}

export function useUpdateUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UserUpdate }) =>
            usersApi.patch(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all() }),
    });
}
