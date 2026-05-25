import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { banksApi } from "../banksService";
import { bankKeys } from "../banks.keys";
import type { BankFilters, BankCreate, BankUpdate } from "../types";

export function useBanks(filters?: BankFilters, page = 1) {
    return useQuery({
        queryKey: bankKeys.list(filters, page),
        queryFn: () => banksApi.list({ ...filters, page }),
    });
}

export function useBank(id: number) {
    return useQuery({
        queryKey: bankKeys.detail(id),
        queryFn: () => banksApi.getById(id),
        enabled: !!id,
    });
}

export function useCreateBank() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: BankCreate) => banksApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: bankKeys.all() }),
    });
}

export function useUpdateBank() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: BankUpdate }) =>
            banksApi.patch(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: bankKeys.all() }),
    });
}

export function useDeleteBank() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => banksApi.remove(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: bankKeys.all() }),
    });
}
