import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionSharesApi } from "../transactionSharesService";
import { transactionShareKeys } from "../transactionShares.keys";
import type {
    TransactionShareFilters,
    TransactionShareCreate,
    TransactionShareUpdate,
} from "../types";

export function useTransactionShares(
    filters?: TransactionShareFilters,
    page = 1,
) {
    return useQuery({
        queryKey: transactionShareKeys.list(filters, page),
        queryFn: () => transactionSharesApi.list({ ...filters, page }),
    });
}

export function useTransactionShare(id: number) {
    return useQuery({
        queryKey: transactionShareKeys.detail(id),
        queryFn: () => transactionSharesApi.getById(id),
        enabled: !!id,
    });
}

export function useCreateTransactionShare() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: TransactionShareCreate) =>
            transactionSharesApi.create(data),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: transactionShareKeys.all() }),
    });
}

export function useUpdateTransactionShare() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: TransactionShareUpdate;
        }) => transactionSharesApi.patch(id, data),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: transactionShareKeys.all() }),
    });
}

export function useDeleteTransactionShare() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => transactionSharesApi.remove(id),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: transactionShareKeys.all() }),
    });
}
