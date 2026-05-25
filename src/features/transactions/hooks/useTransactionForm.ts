import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiError";
import {
    useCreateTransaction,
    useUpdateTransaction,
} from "./useTransactionQueries";
import {
    transactionFormSchema,
    type TransactionFormData,
    defaultValues,
} from "../schemas/transactionFormSchema";
import type { Transaction } from "../types";

export type { TransactionFormData };

interface UseTransactionFormProps {
    editData?: Transaction;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function useTransactionForm({
    editData,
    onSuccess,
    onClose,
}: UseTransactionFormProps) {
    const createMutation = useCreateTransaction();
    const updateMutation = useUpdateTransaction();

    const form = useForm<TransactionFormData>({
        resolver: zodResolver(transactionFormSchema),
        defaultValues,
    });

    const { reset, handleSubmit } = form;

    useEffect(() => {
        if (editData) {
            reset({
                type: editData.type,
                description: editData.description,
                amount: editData.amount,
                transaction_date: editData.transaction_date,
                status: editData.status,
                account: editData.account,
                credit_card: editData.credit_card,
                category: editData.category,
                notes: editData.notes,
            });
        }
    }, [editData, reset]);

    const onDialogClose = () => {
        reset(defaultValues);
        onClose?.();
    };

    const submitHandler = async (data: TransactionFormData) => {
        const payload = {
            type: data.type,
            description: data.description,
            amount: data.amount,
            transaction_date: data.transaction_date,
            status: data.status,
            account: data.account ?? null,
            credit_card: data.credit_card ?? null,
            category: data.category ?? null,
            notes: data.notes ?? "",
        };

        if (editData) {
            await updateMutation.mutateAsync(
                { id: editData.id, data: payload },
                {
                    onSuccess: () => {
                        toast.success("Transação atualizada com sucesso.");
                        onSuccess?.();
                    },
                    onError: (error) => {
                        toast.error(
                            getApiErrorMessage(
                                error,
                                "Erro ao atualizar transação.",
                            ),
                        );
                    },
                },
            );
        } else {
            await createMutation.mutateAsync(payload, {
                onSuccess: () => {
                    toast.success("Transação criada com sucesso.");
                    reset(defaultValues);
                    onSuccess?.();
                },
                onError: (error) => {
                    toast.error(
                        getApiErrorMessage(error, "Erro ao criar transação."),
                    );
                },
            });
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return {
        form,
        onDialogClose,
        isLoading,
        onSubmit: handleSubmit(submitHandler),
    };
}
