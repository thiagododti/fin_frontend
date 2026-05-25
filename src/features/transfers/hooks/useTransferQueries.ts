import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transfersApi } from "../transfersService";
import { transferKeys } from "../transfers.keys";
import type { TransferFilters, TransferCreate, TransferUpdate } from "../types";

export function useTransfers(filters?: TransferFilters, page = 1) {
    return useQuery({
        queryKey: transferKeys.list(filters, page),
        queryFn: () => transfersApi.list({ ...filters, page }),
    });
}

export function useTransfer(id: number) {
    return useQuery({
        queryKey: transferKeys.detail(id),
        queryFn: () => transfersApi.getById(id),
        enabled: !!id,
    });
}

export function useCreateTransfer() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: TransferCreate) => transfersApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: transferKeys.all() }),
    });
}

export function useUpdateTransfer() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: TransferUpdate }) =>
            transfersApi.patch(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: transferKeys.all() }),
    });
}

export function useDeleteTransfer() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => transfersApi.remove(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: transferKeys.all() }),
    });
}
