import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { creditCardsApi } from "../creditCardsService";
import { creditCardKeys } from "../creditCards.keys";
import type {
    CreditCardFilters,
    CreditCardCreate,
    CreditCardUpdate,
} from "../types";

export function useCreditCards(filters?: CreditCardFilters, page = 1) {
    return useQuery({
        queryKey: creditCardKeys.list(filters, page),
        queryFn: () => creditCardsApi.list({ ...filters, page }),
    });
}

export function useCreditCard(id: number) {
    return useQuery({
        queryKey: creditCardKeys.detail(id),
        queryFn: () => creditCardsApi.getById(id),
        enabled: !!id,
    });
}

export function useCreateCreditCard() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreditCardCreate) => creditCardsApi.create(data),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: creditCardKeys.all() }),
    });
}

export function useUpdateCreditCard() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: CreditCardUpdate }) =>
            creditCardsApi.patch(id, data),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: creditCardKeys.all() }),
    });
}

export function useDeleteCreditCard() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => creditCardsApi.remove(id),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: creditCardKeys.all() }),
    });
}
