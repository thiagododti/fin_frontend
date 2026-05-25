import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiError";
import {
    useCreateTransactionShare,
    useUpdateTransactionShare,
} from "./useTransactionShareQueries";
import {
    transactionShareFormSchema,
    type TransactionShareFormData,
    defaultValues,
} from "../schemas/transactionShareFormSchema";
import type { TransactionShare } from "../types";

export type { TransactionShareFormData };

interface UseTransactionShareFormProps {
    editData?: TransactionShare;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function useTransactionShareForm({
    editData,
    onSuccess,
    onClose,
}: UseTransactionShareFormProps) {
    const createMutation = useCreateTransactionShare();
    const updateMutation = useUpdateTransactionShare();

    const form = useForm<TransactionShareFormData>({
        resolver: zodResolver(transactionShareFormSchema),
        defaultValues,
    });

    const { reset, handleSubmit } = form;

    useEffect(() => {
        if (editData) {
            reset({
                transaction: editData.transaction,
                group_member: editData.group_member,
                amount: editData.amount,
                status: editData.status,
            });
        }
    }, [editData, reset]);

    const onDialogClose = () => {
        reset(defaultValues);
        onClose?.();
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    const onSubmit = handleSubmit(async (values) => {
        if (editData) {
            await updateMutation.mutateAsync(
                {
                    id: editData.id,
                    data: { amount: values.amount, status: values.status },
                },
                {
                    onSuccess: () => {
                        toast.success("Rateio atualizado com sucesso.");
                        reset(defaultValues);
                        onSuccess?.();
                    },
                    onError: (error) => {
                        toast.error(
                            getApiErrorMessage(
                                error,
                                "Erro ao atualizar rateio.",
                            ),
                        );
                    },
                },
            );
        } else {
            await createMutation.mutateAsync(values, {
                onSuccess: () => {
                    toast.success("Rateio criado com sucesso.");
                    reset(defaultValues);
                    onSuccess?.();
                },
                onError: (error) => {
                    toast.error(
                        getApiErrorMessage(error, "Erro ao criar rateio."),
                    );
                },
            });
        }
    });

    return { form, onDialogClose, isLoading, onSubmit };
}
