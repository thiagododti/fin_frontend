import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsApi } from "../accountsService";
import { accountKeys } from "../accounts.keys";
import type { AccountFilters, AccountCreate, AccountUpdate } from "../types";

export function useAccounts(filters?: AccountFilters, page = 1) {
    return useQuery({
        queryKey: accountKeys.list(filters, page),
        queryFn: () => accountsApi.list({ ...filters, page }),
    });
}

export function useAccount(id: number) {
    return useQuery({
        queryKey: accountKeys.detail(id),
        queryFn: () => accountsApi.getById(id),
        enabled: !!id,
    });
}

export function useCreateAccount() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: AccountCreate) => accountsApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.all() }),
    });
}

export function useUpdateAccount() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: AccountUpdate }) =>
            accountsApi.patch(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.all() }),
    });
}

export function useDeleteAccount() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => accountsApi.remove(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.all() }),
    });
}
