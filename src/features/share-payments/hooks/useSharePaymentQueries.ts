import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sharePaymentsApi } from "../sharePaymentsService";
import { sharePaymentKeys } from "../sharePayments.keys";
import type {
    SharePaymentFilters,
    SharePaymentCreate,
    SharePaymentUpdate,
} from "../types";

export function useSharePayments(filters?: SharePaymentFilters, page = 1) {
    return useQuery({
        queryKey: sharePaymentKeys.list(filters, page),
        queryFn: () => sharePaymentsApi.list({ ...filters, page }),
    });
}

export function useSharePayment(id: number) {
    return useQuery({
        queryKey: sharePaymentKeys.detail(id),
        queryFn: () => sharePaymentsApi.getById(id),
        enabled: !!id,
    });
}

export function useCreateSharePayment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: SharePaymentCreate) => sharePaymentsApi.create(data),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: sharePaymentKeys.all() }),
    });
}

export function useUpdateSharePayment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: SharePaymentUpdate }) =>
            sharePaymentsApi.patch(id, data),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: sharePaymentKeys.all() }),
    });
}

export function useDeleteSharePayment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => sharePaymentsApi.remove(id),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: sharePaymentKeys.all() }),
    });
}
