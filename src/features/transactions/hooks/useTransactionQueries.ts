import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsApi } from "../transactionsService";
import { transactionKeys } from "../transactions.keys";
import type {
    TransactionFilters,
    TransactionCreate,
    TransactionUpdate,
} from "../types";

export function useTransactions(filters?: TransactionFilters, page = 1) {
    return useQuery({
        queryKey: transactionKeys.list(filters, page),
        queryFn: () => transactionsApi.list({ ...filters, page }),
    });
}

export function useTransaction(id: number) {
    return useQuery({
        queryKey: transactionKeys.detail(id),
        queryFn: () => transactionsApi.getById(id),
        enabled: !!id,
    });
}

export function useCreateTransaction() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: TransactionCreate) => transactionsApi.create(data),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: transactionKeys.all() }),
    });
}

export function useUpdateTransaction() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: TransactionUpdate }) =>
            transactionsApi.patch(id, data),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: transactionKeys.all() }),
    });
}

export function useDeleteTransaction() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => transactionsApi.remove(id),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: transactionKeys.all() }),
    });
}
