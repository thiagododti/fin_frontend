import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersApi } from "../usersService";
import { userKeys } from "../users.keys";
import { getApiErrorMessage } from "@/lib/apiError";
import type { UserFilters, UserCreate, UserUpdate } from "../types";

// ─── Users ────────────────────────────────────────────────────────────────────

export function useUsers(filters?: UserFilters, page = 1) {
    return useQuery({
        queryKey: userKeys.list(filters, page),
        queryFn: () => usersApi.list({ ...filters, page }),
    });
}

export function useUser(id: number) {
    return useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => usersApi.getById(id),
        enabled: !!id,
    });
}

export function useCreateUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: UserCreate) => usersApi.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: userKeys.all() });
            toast.success("Usuário criado com sucesso.");
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Erro ao criar usuário."));
        },
    });
}

export function useUpdateUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UserUpdate }) =>
            usersApi.patch(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: userKeys.all() });
            toast.success("Usuário atualizado com sucesso.");
        },
        onError: (error) => {
            toast.error(
                getApiErrorMessage(error, "Erro ao atualizar usuário."),
            );
        },
    });
}
